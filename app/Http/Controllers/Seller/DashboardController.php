<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Car;
use App\Models\Message;
use App\Models\ChatRoom;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $seller = auth()->user();
        
        // Get seller statistics
        $totalCars = $seller->cars()->count();
        $availableCars = $seller->cars()->where('status', Car::STATUS_AVAILABLE)->count();
        $soldCars = $seller->cars()->where('status', Car::STATUS_SOLD)->count();
        $featuredCars = $seller->cars()->where('is_featured', true)->count();
        
        $totalViews = $seller->cars()->sum('views_count');
        $totalInquiries = $seller->cars()->sum('inquiries_count');
        
        // Unread messages count
        $unreadMessages = Message::whereHas('chatRoom.participants', function ($query) use ($seller) {
            $query->where('user_id', $seller->id);
        })
        ->where('sender_id', '!=', $seller->id)
        ->where('is_read', false)
        ->count();

        // Recent cars
        $recentCars = $seller->cars()
            ->latest()
            ->take(5)
            ->get();

        // Monthly performance
        $monthlyData = $this->getMonthlyPerformance($seller);

        // Recent chat activity
        $recentChats = ChatRoom::whereHas('participants', function ($query) use ($seller) {
            $query->where('user_id', $seller->id);
        })
        ->with(['latestMessage.sender', 'participants'])
        ->latest('updated_at')
        ->take(5)
        ->get();

        return Inertia::render('Seller/Dashboard', [
            'stats' => [
                'totalCars' => $totalCars,
                'availableCars' => $availableCars,
                'soldCars' => $soldCars,
                'featuredCars' => $featuredCars,
                'totalViews' => $totalViews,
                'totalInquiries' => $totalInquiries,
                'unreadMessages' => $unreadMessages,
            ],
            'recentCars' => $recentCars,
            'monthlyData' => $monthlyData,
            'recentChats' => $recentChats,
        ]);
    }

    public function pendingApproval()
    {
        return Inertia::render('Seller/PendingApproval');
    }

    private function getMonthlyPerformance($seller)
    {
        $months = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $monthStart = $date->copy()->startOfMonth();
            $monthEnd = $date->copy()->endOfMonth();

            $months[] = [
                'month' => $date->format('M Y'),
                'cars_added' => $seller->cars()
                    ->whereBetween('created_at', [$monthStart, $monthEnd])
                    ->count(),
                'cars_sold' => $seller->cars()
                    ->where('status', Car::STATUS_SOLD)
                    ->whereBetween('updated_at', [$monthStart, $monthEnd])
                    ->count(),
                'views' => $seller->cars()
                    ->whereBetween('created_at', [$monthStart, $monthEnd])
                    ->sum('views_count'),
            ];
        }

        return $months;
    }
}
