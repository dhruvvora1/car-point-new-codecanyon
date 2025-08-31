<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UsersController extends Controller
{
    public function admins(Request $request)
    {
        $query = User::where('role', User::ROLE_ADMIN)
            ->withCount(['cars']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->where('is_active', true);
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        $admins = $query->latest()->paginate(15);

        return Inertia::render('admin/users/Admins', [
            'admins' => $admins,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function sellers(Request $request)
    {
        $query = User::where('role', User::ROLE_SELLER)
            ->with(['sellerProfile'])
            ->withCount(['cars']);

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

        if ($request->filled('status')) {
            if ($request->status === 'pending') {
                $query->where('is_approved', false);
            } elseif ($request->status === 'approved') {
                $query->where('is_approved', true)->where('is_active', true);
            } elseif ($request->status === 'suspended') {
                $query->where('is_active', false);
            }
        }

        if ($request->filled('business_type')) {
            $query->whereHas('sellerProfile', function ($q) use ($request) {
                $q->where('business_type', $request->business_type);
            });
        }

        $sellers = $query->latest()->paginate(15);

        return Inertia::render('admin/users/Sellers', [
            'sellers' => $sellers,
            'filters' => $request->only(['search', 'status', 'business_type']),
        ]);
    }

    public function customers(Request $request)
    {
        $query = User::where('role', User::ROLE_CUSTOMER)
            ->withCount(['favoriteListings', 'bookings']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->where('is_active', true);
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        $customers = $query->latest()->paginate(15);

        return Inertia::render('admin/users/Customers', [
            'customers' => $customers,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function toggleStatus(User $user)
    {
        $user->update(['is_active' => !$user->is_active]);
        
        $status = $user->is_active ? 'activated' : 'deactivated';
        return back()->with('success', "User {$status} successfully!");
    }

    public function destroy(User $user)
    {
        // Prevent deleting the last admin
        if ($user->isAdmin() && User::where('role', User::ROLE_ADMIN)->count() <= 1) {
            return back()->with('error', 'Cannot delete the last admin user!');
        }

        $user->delete();
        return back()->with('success', 'User deleted successfully!');
    }
}
