<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Car;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class CarController extends Controller
{
    public function index(Request $request)
    {
        $seller = auth()->user();
        $query = $seller->cars();

        // Apply filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('brand', 'like', "%{$search}%")
                  ->orWhere('model', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $cars = $query->latest()->paginate(12);

        return Inertia::render('Seller/Cars/Index', [
            'cars' => $cars,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Seller/Cars/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'mileage' => 'required|integer|min:0',
            'fuel_type' => 'required|in:petrol,diesel,electric,hybrid,cng',
            'transmission' => 'required|in:manual,automatic,cvt',
            'price' => 'required|numeric|min:0',
            'currency' => 'required|string|max:3',
            'location' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'description' => 'required|string',
            'features' => 'nullable|array',
            'images' => 'required|array|min:1|max:10',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'video_url' => 'nullable|url',
        ]);

        // Handle image uploads
        $imageUrls = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('cars', 'public');
                $imageUrls[] = Storage::url($path);
            }
        }

        $validated['images'] = $imageUrls;
        $validated['seller_id'] = auth()->id();

        $car = Car::create($validated);

        return redirect()->route('seller.cars.show', $car)
            ->with('success', 'Car listed successfully!');
    }

    public function show(Car $car)
    {
        $this->authorize('view', $car);
        
        // Increment views count
        $car->increment('views_count');

        return Inertia::render('Seller/Cars/Show', [
            'car' => $car,
        ]);
    }

    public function edit(Car $car)
    {
        $this->authorize('update', $car);

        return Inertia::render('Seller/Cars/Edit', [
            'car' => $car,
        ]);
    }

    public function update(Request $request, Car $car)
    {
        $this->authorize('update', $car);

        $validated = $request->validate([
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'mileage' => 'required|integer|min:0',
            'fuel_type' => 'required|in:petrol,diesel,electric,hybrid,cng',
            'transmission' => 'required|in:manual,automatic,cvt',
            'price' => 'required|numeric|min:0',
            'currency' => 'required|string|max:3',
            'location' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'description' => 'required|string',
            'features' => 'nullable|array',
            'video_url' => 'nullable|url',
            'status' => 'required|in:available,sold,pending',
        ]);

        // Handle new image uploads if provided
        if ($request->hasFile('new_images')) {
            $newImageUrls = [];
            foreach ($request->file('new_images') as $image) {
                $path = $image->store('cars', 'public');
                $newImageUrls[] = Storage::url($path);
            }
            
            // Merge with existing images
            $existingImages = $request->input('existing_images', []);
            $validated['images'] = array_merge($existingImages, $newImageUrls);
        }

        $car->update($validated);

        return redirect()->route('seller.cars.show', $car)
            ->with('success', 'Car updated successfully!');
    }

    public function destroy(Car $car)
    {
        $this->authorize('delete', $car);

        // Delete associated images
        if ($car->images) {
            foreach ($car->images as $imageUrl) {
                $path = str_replace('/storage/', '', parse_url($imageUrl, PHP_URL_PATH));
                Storage::disk('public')->delete($path);
            }
        }

        $car->delete();

        return redirect()->route('seller.cars.index')
            ->with('success', 'Car deleted successfully!');
    }

    public function markAsSold(Car $car)
    {
        $this->authorize('update', $car);

        $car->update(['status' => Car::STATUS_SOLD]);

        return back()->with('success', 'Car marked as sold!');
    }
}
