<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CarController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\SellerController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public API routes
Route::prefix('v1')->group(function () {
    // Authentication
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);
    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('reset-password', [AuthController::class, 'resetPassword']);
    
    // Public car listings (for future buyer side)
    Route::get('cars', [CarController::class, 'index']);
    Route::get('cars/{car}', [CarController::class, 'show']);
    Route::get('cars/search', [CarController::class, 'search']);
});

// Protected API routes
Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    // User profile
    Route::get('user', function (Request $request) {
        return $request->user()->load('sellerProfile');
    });
    Route::post('logout', [AuthController::class, 'logout']);
    
    // Admin API routes
    Route::middleware(['admin'])->prefix('admin')->group(function () {
        Route::get('dashboard-stats', [AdminController::class, 'dashboardStats']);
        Route::get('sellers', [AdminController::class, 'sellers']);
        Route::patch('sellers/{seller}/approve', [AdminController::class, 'approveSeller']);
        Route::patch('sellers/{seller}/reject', [AdminController::class, 'rejectSeller']);
        Route::patch('sellers/{seller}/suspend', [AdminController::class, 'suspendSeller']);
        Route::patch('sellers/{seller}/reactivate', [AdminController::class, 'reactivateSeller']);
        
        Route::get('cars', [AdminController::class, 'cars']);
        Route::patch('cars/{car}/toggle-featured', [AdminController::class, 'toggleFeatured']);
        Route::delete('cars/{car}', [AdminController::class, 'deleteCar']);
        
        Route::get('reports/sales', [AdminController::class, 'salesReport']);
        Route::get('reports/cars', [AdminController::class, 'carsReport']);
    });
    
    // Seller API routes
    Route::middleware(['seller'])->prefix('seller')->group(function () {
        Route::get('dashboard-stats', [SellerController::class, 'dashboardStats']);
        Route::resource('cars', SellerController::class);
        Route::patch('cars/{car}/mark-sold', [SellerController::class, 'markAsSold']);
        
        Route::get('profile', [SellerController::class, 'profile']);
        Route::patch('profile', [SellerController::class, 'updateProfile']);
    });
    
    // Chat API routes (for both admin and sellers)
    Route::prefix('chat')->group(function () {
        Route::get('rooms', [ChatController::class, 'getRooms']);
        Route::post('rooms', [ChatController::class, 'createRoom']);
        Route::get('rooms/{room}/messages', [ChatController::class, 'getMessages']);
        Route::post('rooms/{room}/messages', [ChatController::class, 'sendMessage']);
        Route::patch('rooms/{room}/messages/{message}/read', [ChatController::class, 'markAsRead']);
    });
});
