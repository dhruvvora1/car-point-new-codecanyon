<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Car;
use App\Models\Message;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // Get dashboard statistics
        $totalSellers = User::where('role', User::ROLE_SELLER)->count();
        $activeSellers = User::where('role', User::ROLE_SELLER)
            ->where('is_active', true)
            ->where('is_approved', true)
            ->count();
        $pendingSellers = User::where('role', User::ROLE_SELLER)
            ->where('is_approved', false)
            ->count();
        
        $totalCars = Car::count();
        $availableCars = Car::where('status', Car::STATUS_AVAILABLE)->count();
        $soldCars = Car::where('status', Car::STATUS_SOLD)->count();
        $featuredCars = Car::where('is_featured', true)->count();

        // Monthly statistics for charts
        $monthlyData = $this->getMonthlyStatistics();
        
        // Recent activities
        $recentSellers = User::where('role', User::ROLE_SELLER)
            ->latest()
            ->take(5)
            ->get();
            
        $recentCars = Car::with('seller')
            ->latest()
            ->take(5)
            ->get();

        // Top performing sellers
        $topSellers = User::where('role', User::ROLE_SELLER)
            ->where('is_approved', true)
            ->withCount('cars')
            ->orderBy('cars_count', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalSellers' => $totalSellers,
                'activeSellers' => $activeSellers,
                'pendingSellers' => $pendingSellers,
                'totalCars' => $totalCars,
                'availableCars' => $availableCars,
                'soldCars' => $soldCars,
                'featuredCars' => $featuredCars,
            ],
            'monthlyData' => $monthlyData,
            'recentSellers' => $recentSellers,
            'recentCars' => $recentCars,
            'topSellers' => $topSellers,
        ]);
    }

    private function getMonthlyStatistics()
    {
        $months = [];
        for ($i = 11; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $monthStart = $date->copy()->startOfMonth();
            $monthEnd = $date->copy()->endOfMonth();

            $months[] = [
                'month' => $date->format('M Y'),
                'sellers' => User::where('role', User::ROLE_SELLER)
                    ->whereBetween('created_at', [$monthStart, $monthEnd])
                    ->count(),
                'cars' => Car::whereBetween('created_at', [$monthStart, $monthEnd])
                    ->count(),
                'sales' => Car::where('status', Car::STATUS_SOLD)
                    ->whereBetween('updated_at', [$monthStart, $monthEnd])
                    ->count(),
            ];
        }

        return $months;
    }
}
