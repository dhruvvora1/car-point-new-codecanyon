<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Car;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ListingsController extends Controller
{
    public function add()
    {
        return Inertia::render('seller/listings/AddCar');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'brand' => 'required|string|max:100',
            'model' => 'required|string|max:100',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'mileage' => 'required|integer|min:0',
            'fuel_type' => 'required|string|in:petrol,diesel,electric,hybrid,cng',
            'transmission' => 'required|string|in:manual,automatic,cvt',
            'price' => 'required|numeric|min:0',
            'currency' => 'required|string|in:INR,USD,EUR',
            'location' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'country' => 'required|string|max:100',
            'description' => 'required|string|min:50',
            'features' => 'nullable|array',
            'video_url' => 'nullable|url',
            'images.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle image uploads
        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('cars', 'public');
                $imagePaths[] = $path;
            }
        }

        $validated['images'] = $imagePaths;
        $validated['seller_id'] = auth()->id();
        $validated['status'] = Car::STATUS_PENDING; // Requires admin approval

        Car::create($validated);

        return redirect()->route('seller.listings.pending')
            ->with('success', 'Car listing submitted for approval!');
    }

    public function active(Request $request)
    {
        $query = auth()->user()->cars()
            ->where('status', Car::STATUS_AVAILABLE);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('brand', 'like', "%{$search}%")
                  ->orWhere('model', 'like', "%{$search}%");
            });
        }

        $activeCars = $query->latest()->paginate(12);

        return Inertia::render('seller/listings/ActiveListings', [
            'cars' => $activeCars,
            'filters' => $request->only(['search']),
        ]);
    }

    public function pending(Request $request)
    {
        $query = auth()->user()->cars()
            ->where('status', Car::STATUS_PENDING);

        $pendingCars = $query->latest()->paginate(12);

        return Inertia::render('seller/listings/PendingApproval', [
            'cars' => $pendingCars,
        ]);
    }

    public function sold(Request $request)
    {
        $query = auth()->user()->cars()
            ->where('status', Car::STATUS_SOLD)
            ->with(['transactions']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('brand', 'like', "%{$search}%")
                  ->orWhere('model', 'like', "%{$search}%");
            });
        }

        $soldCars = $query->latest('updated_at')->paginate(12);

        $stats = [
            'total_sold' => auth()->user()->cars()->where('status', Car::STATUS_SOLD)->count(),
            'total_revenue' => auth()->user()->cars()
                ->where('status', Car::STATUS_SOLD)
                ->sum('price'),
        ];

        return Inertia::render('seller/listings/SoldHistory', [
            'cars' => $soldCars,
            'stats' => $stats,
            'filters' => $request->only(['search']),
        ]);
    }

    public function edit(Car $car)
    {
        $this->authorize('update', $car);

        return Inertia::render('seller/listings/EditCar', [
            'car' => $car,
        ]);
    }

    public function update(Request $request, Car $car)
    {
        $this->authorize('update', $car);

        $validated = $request->validate([
            'brand' => 'required|string|max:100',
            'model' => 'required|string|max:100',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'mileage' => 'required|integer|min:0',
            'fuel_type' => 'required|string|in:petrol,diesel,electric,hybrid,cng',
            'transmission' => 'required|string|in:manual,automatic,cvt',
            'price' => 'required|numeric|min:0',
            'location' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'description' => 'required|string|min:50',
            'features' => 'nullable|array',
            'video_url' => 'nullable|url',
        ]);

        // Handle new image uploads if any
        if ($request->hasFile('new_images')) {
            $newImagePaths = [];
            foreach ($request->file('new_images') as $image) {
                $path = $image->store('cars', 'public');
                $newImagePaths[] = $path;
            }
            $validated['images'] = array_merge($car->images ?? [], $newImagePaths);
        }

        $car->update($validated);

        return back()->with('success', 'Car listing updated successfully!');
    }

    public function destroy(Car $car)
    {
        $this->authorize('delete', $car);

        // Delete associated images
        if ($car->images) {
            foreach ($car->images as $image) {
                Storage::disk('public')->delete($image);
            }
        }

        $car->delete();

        return redirect()->route('seller.listings.active')
            ->with('success', 'Car listing deleted successfully!');
    }

    public function markAsSold(Car $car)
    {
        $this->authorize('update', $car);

        $car->update(['status' => Car::STATUS_SOLD]);

        return back()->with('success', 'Car marked as sold successfully!');
    }
}
