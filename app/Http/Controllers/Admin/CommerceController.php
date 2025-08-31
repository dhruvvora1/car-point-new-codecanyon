<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\Payment;
use App\Models\Transaction;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommerceController extends Controller
{
    public function subscriptions(Request $request)
    {
        $query = Subscription::with(['user']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('plan')) {
            $query->where('plan_type', $request->plan);
        }

        $subscriptions = $query->latest()->paginate(15);

        $stats = [
            'total' => Subscription::count(),
            'active' => Subscription::where('status', 'active')->count(),
            'expired' => Subscription::where('status', 'expired')->count(),
            'cancelled' => Subscription::where('status', 'cancelled')->count(),
        ];

        return Inertia::render('admin/commerce/Subscriptions', [
            'subscriptions' => $subscriptions,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status', 'plan']),
        ]);
    }

    public function payments(Request $request)
    {
        $query = Payment::with(['user', 'subscription']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('transaction_id', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('method')) {
            $query->where('payment_method', $request->method);
        }

        $payments = $query->latest()->paginate(15);

        $stats = [
            'total_amount' => Payment::where('status', 'completed')->sum('amount'),
            'total_payments' => Payment::count(),
            'successful' => Payment::where('status', 'completed')->count(),
            'failed' => Payment::where('status', 'failed')->count(),
        ];

        return Inertia::render('admin/commerce/Payments', [
            'payments' => $payments,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status', 'method']),
        ]);
    }

    public function transactions(Request $request)
    {
        $query = Transaction::with(['buyer', 'seller', 'car']);

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

        $transactions = $query->latest()->paginate(15);

        $stats = [
            'total_value' => Transaction::where('status', 'completed')->sum('amount'),
            'total_transactions' => Transaction::count(),
            'completed' => Transaction::where('status', 'completed')->count(),
            'pending' => Transaction::where('status', 'pending')->count(),
        ];

        return Inertia::render('admin/commerce/Transactions', [
            'transactions' => $transactions,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function coupons(Request $request)
    {
        $query = Coupon::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->where('is_active', true)
                      ->where('expires_at', '>', now());
            } elseif ($request->status === 'expired') {
                $query->where('expires_at', '<=', now());
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        $coupons = $query->latest()->paginate(15);

        return Inertia::render('admin/commerce/Coupons', [
            'coupons' => $coupons,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function createCoupon(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:coupons,code|max:50',
            'description' => 'required|string|max:255',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'minimum_amount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'expires_at' => 'required|date|after:now',
            'is_active' => 'boolean',
        ]);

        Coupon::create($validated);

        return back()->with('success', 'Coupon created successfully!');
    }

    public function updateCoupon(Request $request, Coupon $coupon)
    {
        $validated = $request->validate([
            'description' => 'required|string|max:255',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'minimum_amount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'expires_at' => 'required|date',
            'is_active' => 'boolean',
        ]);

        $coupon->update($validated);

        return back()->with('success', 'Coupon updated successfully!');
    }

    public function toggleCoupon(Coupon $coupon)
    {
        $coupon->update(['is_active' => !$coupon->is_active]);
        
        $status = $coupon->is_active ? 'activated' : 'deactivated';
        return back()->with('success', "Coupon {$status} successfully!");
    }
}
