<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Car;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Reports/Index');
    }

    public function salesReport(Request $request)
    {
        $validated = $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'period' => 'nullable|in:week,month,quarter,year',
        ]);

        $startDate = $validated['start_date'] ? Carbon::parse($validated['start_date']) : Carbon::now()->subMonth();
        $endDate = $validated['end_date'] ? Carbon::parse($validated['end_date']) : Carbon::now();

        // Sales data
        $salesData = Car::where('status', Car::STATUS_SOLD)
            ->whereBetween('updated_at', [$startDate, $endDate])
            ->with(['seller', 'seller.sellerProfile'])
            ->get();

        $totalSales = $salesData->count();
        $totalRevenue = $salesData->sum('price');
        $averagePrice = $totalSales > 0 ? $totalRevenue / $totalSales : 0;

        // Group by period
        $period = $validated['period'] ?? 'month';
        $groupedSales = $this->groupSalesByPeriod($salesData, $period);

        // Top brands
        $topBrands = $salesData->groupBy('brand')
            ->map(function ($cars) {
                return [
                    'brand' => $cars->first()->brand,
                    'count' => $cars->count(),
                    'revenue' => $cars->sum('price'),
                ];
            })
            ->sortByDesc('count')
            ->take(10)
            ->values();

        // Top sellers
        $topSellers = $salesData->groupBy('seller_id')
            ->map(function ($cars) {
                $seller = $cars->first()->seller;
                return [
                    'seller' => $seller,
                    'count' => $cars->count(),
                    'revenue' => $cars->sum('price'),
                ];
            })
            ->sortByDesc('count')
            ->take(10)
            ->values();

        return Inertia::render('Admin/Reports/Sales', [
            'salesData' => [
                'totalSales' => $totalSales,
                'totalRevenue' => $totalRevenue,
                'averagePrice' => $averagePrice,
                'groupedSales' => $groupedSales,
                'topBrands' => $topBrands,
                'topSellers' => $topSellers,
            ],
            'filters' => [
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
                'period' => $period,
            ],
        ]);
    }

    public function carsReport(Request $request)
    {
        $validated = $request->validate([
            'status' => 'nullable|in:available,sold,pending',
            'brand' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $query = Car::with(['seller', 'seller.sellerProfile']);

        if (isset($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        if (isset($validated['brand'])) {
            $query->where('brand', 'like', "%{$validated['brand']}%");
        }

        if (isset($validated['start_date'])) {
            $query->whereDate('created_at', '>=', $validated['start_date']);
        }

        if (isset($validated['end_date'])) {
            $query->whereDate('created_at', '<=', $validated['end_date']);
        }

        $cars = $query->latest()->paginate(20);

        // Summary statistics
        $totalCars = Car::count();
        $availableCars = Car::where('status', Car::STATUS_AVAILABLE)->count();
        $soldCars = Car::where('status', Car::STATUS_SOLD)->count();
        $featuredCars = Car::where('is_featured', true)->count();

        // Brand distribution
        $brandStats = Car::select('brand', DB::raw('count(*) as count'))
            ->groupBy('brand')
            ->orderBy('count', 'desc')
            ->take(10)
            ->get();

        return Inertia::render('Admin/Reports/Cars', [
            'cars' => $cars,
            'stats' => [
                'totalCars' => $totalCars,
                'availableCars' => $availableCars,
                'soldCars' => $soldCars,
                'featuredCars' => $featuredCars,
            ],
            'brandStats' => $brandStats,
            'filters' => $validated,
        ]);
    }

    private function groupSalesByPeriod($salesData, $period)
    {
        $format = match($period) {
            'week' => 'Y-W',
            'month' => 'Y-m',
            'quarter' => 'Y-Q',
            'year' => 'Y',
            default => 'Y-m',
        };

        return $salesData->groupBy(function ($car) use ($format) {
            return Carbon::parse($car->updated_at)->format($format);
        })->map(function ($cars, $period) {
            return [
                'period' => $period,
                'count' => $cars->count(),
                'revenue' => $cars->sum('price'),
            ];
        })->values();
    }
}
