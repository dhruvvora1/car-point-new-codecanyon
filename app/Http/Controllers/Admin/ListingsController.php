<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Car;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ListingsController extends Controller
{
    public function approval(Request $request)
    {
        $query = Car::where('status', Car::STATUS_PENDING)
            ->with(['seller', 'seller.sellerProfile']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('brand', 'like', "%{$search}%")
                  ->orWhere('model', 'like', "%{$search}%")
                  ->orWhereHas('seller', function ($sq) use ($search) {
                      $sq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $pendingCars = $query->latest()->paginate(12);

        return Inertia::render('admin/listings/ApprovalQueue', [
            'pendingCars' => $pendingCars,
            'filters' => $request->only(['search']),
        ]);
    }

    public function all(Request $request)
    {
        $query = Car::with(['seller', 'seller.sellerProfile']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('brand', 'like', "%{$search}%")
                  ->orWhere('model', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('brand')) {
            $query->where('brand', 'like', "%{$request->brand}%");
        }

        if ($request->filled('seller')) {
            $query->whereHas('seller', function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->seller}%");
            });
        }

        if ($request->filled('featured')) {
            $query->where('is_featured', $request->featured === 'true');
        }

        $cars = $query->latest()->paginate(12);
        $brands = Car::distinct()->pluck('brand')->sort()->values();
        $sellers = User::where('role', User::ROLE_SELLER)
            ->select('id', 'name', 'email')
            ->get();

        return Inertia::render('admin/listings/AllListings', [
            'cars' => $cars,
            'brands' => $brands,
            'sellers' => $sellers,
            'filters' => $request->only(['search', 'status', 'brand', 'seller', 'featured']),
        ]);
    }

    public function mediaReview(Request $request)
    {
        $query = Car::whereNotNull('images')
            ->with(['seller']);

        if ($request->filled('status')) {
            if ($request->status === 'flagged') {
                $query->where('media_flagged', true);
            } elseif ($request->status === 'approved') {
                $query->where('media_approved', true);
            }
        }

        $cars = $query->latest()->paginate(12);

        return Inertia::render('admin/listings/MediaReview', [
            'cars' => $cars,
            'filters' => $request->only(['status']),
        ]);
    }

    public function approveListing(Car $car)
    {
        $car->update(['status' => Car::STATUS_AVAILABLE]);
        return back()->with('success', 'Listing approved successfully!');
    }

    public function rejectListing(Car $car, Request $request)
    {
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $car->update([
            'status' => Car::STATUS_REJECTED,
            'rejection_reason' => $request->reason,
        ]);

        return back()->with('success', 'Listing rejected successfully!');
    }

    public function flagMedia(Car $car, Request $request)
    {
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $car->update([
            'media_flagged' => true,
            'media_flag_reason' => $request->reason,
        ]);

        return back()->with('success', 'Media flagged for review!');
    }

    public function approveMedia(Car $car)
    {
        $car->update([
            'media_approved' => true,
            'media_flagged' => false,
            'media_flag_reason' => null,
        ]);

        return back()->with('success', 'Media approved successfully!');
    }
}
