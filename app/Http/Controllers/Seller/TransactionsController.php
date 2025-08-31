<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionsController extends Controller
{
    public function sales(Request $request)
    {
        $query = Transaction::where('seller_id', auth()->id())
            ->where('type', Transaction::TYPE_SALE)
            ->with(['buyer', 'car']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('transaction_id', 'like', "%{$search}%")
                  ->orWhereHas('car', function ($cq) use ($search) {
                      $cq->where('brand', 'like', "%{$search}%")
                        ->orWhere('model', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $sales = $query->latest()->paginate(15);

        $stats = [
            'total_sales' => Transaction::where('seller_id', auth()->id())
                ->where('type', Transaction::TYPE_SALE)
                ->where('status', 'completed')
                ->count(),
            'total_revenue' => Transaction::where('seller_id', auth()->id())
                ->where('type', Transaction::TYPE_SALE)
                ->where('status', 'completed')
                ->sum('net_amount'),
            'pending_sales' => Transaction::where('seller_id', auth()->id())
                ->where('type', Transaction::TYPE_SALE)
                ->where('status', 'pending')
                ->count(),
        ];

        return Inertia::render('seller/transactions/CompletedSales', [
            'sales' => $sales,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function earnings(Request $request)
    {
        $query = Transaction::where('seller_id', auth()->id())
            ->where('status', 'completed');

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('completed_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('completed_at', '<=', $request->date_to);
        }

        $earnings = $query->latest('completed_at')->paginate(15);

        // Calculate earnings summary
        $totalEarnings = Transaction::where('seller_id', auth()->id())
            ->where('status', 'completed')
            ->sum('net_amount');

        $monthlyEarnings = Transaction::where('seller_id', auth()->id())
            ->where('status', 'completed')
            ->whereMonth('completed_at', now()->month)
            ->whereYear('completed_at', now()->year)
            ->sum('net_amount');

        $totalCommission = Transaction::where('seller_id', auth()->id())
            ->where('status', 'completed')
            ->sum('commission_amount');

        return Inertia::render('seller/transactions/Earnings', [
            'earnings' => $earnings,
            'stats' => [
                'total_earnings' => $totalEarnings,
                'monthly_earnings' => $monthlyEarnings,
                'total_commission' => $totalCommission,
                'average_sale' => $earnings->count() > 0 ? $totalEarnings / $earnings->total() : 0,
            ],
            'filters' => $request->only(['date_from', 'date_to']),
        ]);
    }

    public function paymentHistory(Request $request)
    {
        $query = Payment::whereHas('subscription.user', function ($q) {
            $q->where('id', auth()->id());
        })->with(['subscription']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $payments = $query->latest()->paginate(15);

        return Inertia::render('seller/transactions/PaymentHistory', [
            'payments' => $payments,
            'filters' => $request->only(['status']),
        ]);
    }

    public function commissionTracking(Request $request)
    {
        $query = Transaction::where('seller_id', auth()->id())
            ->where('status', 'completed')
            ->whereNotNull('commission_amount');

        // Group by month for tracking
        $monthlyCommissions = $query->selectRaw('
            YEAR(completed_at) as year,
            MONTH(completed_at) as month,
            SUM(commission_amount) as total_commission,
            COUNT(*) as transaction_count
        ')
        ->groupBy('year', 'month')
        ->orderBy('year', 'desc')
        ->orderBy('month', 'desc')
        ->get();

        $totalCommission = Transaction::where('seller_id', auth()->id())
            ->where('status', 'completed')
            ->sum('commission_amount');

        return Inertia::render('seller/transactions/CommissionTracking', [
            'monthlyCommissions' => $monthlyCommissions,
            'totalCommission' => $totalCommission,
        ]);
    }
}
