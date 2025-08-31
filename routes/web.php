<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\SellerController as AdminSellerController;
use App\Http\Controllers\Admin\CarController as AdminCarController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Seller\DashboardController as SellerDashboardController;
use App\Http\Controllers\Seller\CarController as SellerCarController;
use App\Http\Controllers\Seller\ProfileController as SellerProfileController;
use App\Http\Controllers\ChatController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Redirect authenticated users to appropriate dashboard
Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        $user = auth()->user();

        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        } elseif ($user->isSeller()) {
            if (!$user->isApproved()) {
                return redirect()->route('seller.pending-approval');
            }
            return redirect()->route('seller.dashboard');
        }

        return Inertia::render('dashboard');
    })->name('dashboard');
});

// Admin Routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Seller Management
    Route::resource('sellers', AdminSellerController::class)->except(['create', 'store']);
    Route::patch('sellers/{seller}/approve', [AdminSellerController::class, 'approve'])->name('sellers.approve');
    Route::patch('sellers/{seller}/reject', [AdminSellerController::class, 'reject'])->name('sellers.reject');
    Route::patch('sellers/{seller}/suspend', [AdminSellerController::class, 'suspend'])->name('sellers.suspend');
    Route::patch('sellers/{seller}/reactivate', [AdminSellerController::class, 'reactivate'])->name('sellers.reactivate');

    // Car Management
    Route::resource('cars', AdminCarController::class)->except(['create', 'store']);
    Route::patch('cars/{car}/toggle-featured', [AdminCarController::class, 'toggleFeatured'])->name('cars.toggle-featured');

    // Reports
    Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('reports/sales', [ReportController::class, 'salesReport'])->name('reports.sales');
    Route::get('reports/cars', [ReportController::class, 'carsReport'])->name('reports.cars');
});

// Seller Routes
Route::middleware(['auth', 'seller'])->prefix('seller')->name('seller.')->group(function () {
    Route::get('dashboard', [SellerDashboardController::class, 'index'])->name('dashboard');

    // Car Management
    Route::resource('cars', SellerCarController::class);
    Route::patch('cars/{car}/mark-sold', [SellerCarController::class, 'markAsSold'])->name('cars.mark-sold');

    // Profile Management
    Route::get('profile', [SellerProfileController::class, 'show'])->name('profile.show');
    Route::get('profile/edit', [SellerProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('profile', [SellerProfileController::class, 'update'])->name('profile.update');
});

// Seller Pending Approval Route
Route::middleware(['auth'])->group(function () {
    Route::get('seller/pending-approval', [SellerDashboardController::class, 'pendingApproval'])->name('seller.pending-approval');
});

// Chat Routes (for both admin and approved sellers)
Route::middleware(['auth'])->prefix('chat')->name('chat.')->group(function () {
    Route::get('/', [ChatController::class, 'index'])->name('index');
    Route::get('room/{chatRoom}', [ChatController::class, 'show'])->name('show');
    Route::post('room/{chatRoom}/send', [ChatController::class, 'sendMessage'])->name('send');
    Route::post('private', [ChatController::class, 'createPrivateChat'])->name('private.create');
    Route::get('group', [ChatController::class, 'getGroupChat'])->name('group');
    Route::get('room/{chatRoom}/history', [ChatController::class, 'getMessageHistory'])->name('history');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
