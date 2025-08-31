<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Car;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CarController extends Controller
{
    public function index(Request $request)
    {
        $query = Car::with(['seller', 'seller.sellerProfile']);

        // Apply filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('brand')) {
            $query->where('brand', 'like', "%{$request->brand}%");
        }

        if ($request->filled('seller')) {
            $query->whereHas('seller', function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->seller}%")
                  ->orWhere('email', 'like', "%{$request->seller}%");
            });
        }

        if ($request->filled('price_min')) {
            $query->where('price', '>=', $request->price_min);
        }

        if ($request->filled('price_max')) {
            $query->where('price', '<=', $request->price_max);
        }

        if ($request->filled('featured')) {
            $query->where('is_featured', $request->featured === 'true');
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('brand', 'like', "%{$search}%")
                  ->orWhere('model', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $cars = $query->latest()->paginate(15);

        // Get filter options
        $brands = Car::distinct()->pluck('brand')->sort()->values();
        $sellers = User::where('role', User::ROLE_SELLER)
            ->where('is_approved', true)
            ->select('id', 'name', 'email')
            ->get();

        return Inertia::render('Admin/Cars/Index', [
            'cars' => $cars,
            'filters' => $request->only(['status', 'brand', 'seller', 'price_min', 'price_max', 'featured', 'search']),
            'brands' => $brands,
            'sellers' => $sellers,
        ]);
    }

    public function show(Car $car)
    {
        $car->load(['seller', 'seller.sellerProfile']);

        return Inertia::render('Admin/Cars/Show', [
            'car' => $car,
        ]);
    }

    public function edit(Car $car)
    {
        $car->load(['seller', 'seller.sellerProfile']);

        return Inertia::render('Admin/Cars/Edit', [
            'car' => $car,
        ]);
    }

    public function update(Request $request, Car $car)
    {
        $validated = $request->validate([
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'mileage' => 'required|integer|min:0',
            'fuel_type' => 'required|in:petrol,diesel,electric,hybrid,cng',
            'transmission' => 'required|in:manual,automatic,cvt',
            'price' => 'required|numeric|min:0',
            'location' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'description' => 'required|string',
            'features' => 'nullable|array',
            'status' => 'required|in:available,sold,pending',
            'is_featured' => 'boolean',
        ]);

        $car->update($validated);

        return redirect()->route('admin.cars.show', $car)
            ->with('success', 'Car updated successfully!');
    }

    public function toggleFeatured(Car $car)
    {
        $car->update(['is_featured' => !$car->is_featured]);

        $status = $car->is_featured ? 'featured' : 'unfeatured';
        return back()->with('success', "Car {$status} successfully!");
    }

    public function destroy(Car $car)
    {
        $car->delete();

        return redirect()->route('admin.cars.index')
            ->with('success', 'Car deleted successfully!');
    }
}
