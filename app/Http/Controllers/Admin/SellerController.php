<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\SellerProfile;
use App\Models\ChatRoom;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SellerController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('role', User::ROLE_SELLER)
            ->with(['sellerProfile', 'cars'])
            ->withCount('cars');

        // Apply filters
        if ($request->filled('status')) {
            if ($request->status === 'pending') {
                $query->where('is_approved', false);
            } elseif ($request->status === 'approved') {
                $query->where('is_approved', true)->where('is_active', true);
            } elseif ($request->status === 'suspended') {
                $query->where('is_active', false);
            }
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhereHas('sellerProfile', function ($sq) use ($search) {
                      $sq->where('business_name', 'like', "%{$search}%");
                  });
            });
        }

        $sellers = $query->paginate(15);

        return Inertia::render('Admin/Sellers/Index', [
            'sellers' => $sellers,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function show(User $seller)
    {
        $seller->load(['sellerProfile', 'cars' => function ($query) {
            $query->latest()->take(10);
        }]);

        $seller->loadCount('cars');

        return Inertia::render('Admin/Sellers/Show', [
            'seller' => $seller,
        ]);
    }

    public function approve(User $seller)
    {
        $seller->update([
            'is_approved' => true,
            'is_active' => true,
        ]);

        // Add seller to general group chat
        $groupChat = ChatRoom::where('type', ChatRoom::TYPE_GROUP)
            ->where('name', 'General Sellers Chat')
            ->first();
            
        if ($groupChat && !$groupChat->participants()->where('user_id', $seller->id)->exists()) {
            $groupChat->participants()->attach($seller->id);
        }

        return back()->with('success', 'Seller approved successfully!');
    }

    public function reject(User $seller)
    {
        $seller->update([
            'is_approved' => false,
            'is_active' => false,
        ]);

        return back()->with('success', 'Seller rejected successfully!');
    }

    public function suspend(User $seller)
    {
        $seller->update(['is_active' => false]);

        return back()->with('success', 'Seller suspended successfully!');
    }

    public function reactivate(User $seller)
    {
        $seller->update(['is_active' => true]);

        return back()->with('success', 'Seller reactivated successfully!');
    }

    public function destroy(User $seller)
    {
        // Soft delete all seller's cars
        $seller->cars()->delete();
        
        // Remove from chat rooms
        $seller->chatRooms()->detach();
        
        // Delete seller profile
        $seller->sellerProfile()->delete();
        
        // Delete seller account
        $seller->delete();

        return back()->with('success', 'Seller account deleted successfully!');
    }
}
