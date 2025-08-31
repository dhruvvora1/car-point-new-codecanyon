<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\CarAttribute;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CatalogController extends Controller
{
    public function categories(Request $request)
    {
        $query = Category::withCount(['cars']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $categories = $query->orderBy('sort_order')->paginate(15);

        return Inertia::render('admin/catalog/Categories', [
            'categories' => $categories,
            'filters' => $request->only(['search']),
        ]);
    }

    public function attributes(Request $request)
    {
        $attributeTypes = [
            'body_type' => CarAttribute::where('type', 'body_type')->get(),
            'fuel' => CarAttribute::where('type', 'fuel')->get(),
            'transmission' => CarAttribute::where('type', 'transmission')->get(),
            'color' => CarAttribute::where('type', 'color')->get(),
            'features' => CarAttribute::where('type', 'features')->get(),
        ];

        return Inertia::render('admin/catalog/Attributes', [
            'attributeTypes' => $attributeTypes,
        ]);
    }

    public function bodyType(Request $request)
    {
        $bodyTypes = CarAttribute::where('type', 'body_type')
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('sort_order')
            ->paginate(15);

        return Inertia::render('admin/catalog/attributes/BodyType', [
            'bodyTypes' => $bodyTypes,
            'filters' => $request->only(['search']),
        ]);
    }

    public function fuel(Request $request)
    {
        $fuelTypes = CarAttribute::where('type', 'fuel')
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('sort_order')
            ->paginate(15);

        return Inertia::render('admin/catalog/attributes/Fuel', [
            'fuelTypes' => $fuelTypes,
            'filters' => $request->only(['search']),
        ]);
    }

    public function transmission(Request $request)
    {
        $transmissionTypes = CarAttribute::where('type', 'transmission')
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('sort_order')
            ->paginate(15);

        return Inertia::render('admin/catalog/attributes/Transmission', [
            'transmissionTypes' => $transmissionTypes,
            'filters' => $request->only(['search']),
        ]);
    }

    public function color(Request $request)
    {
        $colors = CarAttribute::where('type', 'color')
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('sort_order')
            ->paginate(15);

        return Inertia::render('admin/catalog/attributes/Color', [
            'colors' => $colors,
            'filters' => $request->only(['search']),
        ]);
    }

    public function features(Request $request)
    {
        $features = CarAttribute::where('type', 'features')
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('sort_order')
            ->paginate(15);

        return Inertia::render('admin/catalog/attributes/Features', [
            'features' => $features,
            'filters' => $request->only(['search']),
        ]);
    }

    public function createAttribute(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:body_type,fuel,transmission,color,features',
            'name' => 'required|string|max:100',
            'value' => 'required|string|max:100',
            'description' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        CarAttribute::create($validated);

        return back()->with('success', 'Attribute created successfully!');
    }

    public function updateAttribute(Request $request, CarAttribute $attribute)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'value' => 'required|string|max:100',
            'description' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $attribute->update($validated);

        return back()->with('success', 'Attribute updated successfully!');
    }

    public function deleteAttribute(CarAttribute $attribute)
    {
        $attribute->delete();
        return back()->with('success', 'Attribute deleted successfully!');
    }
}
