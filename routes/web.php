<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\UsersController as AdminUsersController;
use App\Http\Controllers\Admin\ListingsController as AdminListingsController;
use App\Http\Controllers\Admin\CommerceController as AdminCommerceController;
use App\Http\Controllers\Admin\OperationsController as AdminOperationsController;
use App\Http\Controllers\Admin\CatalogController as AdminCatalogController;
use App\Http\Controllers\Seller\DashboardController as SellerDashboardController;
use App\Http\Controllers\Seller\ListingsController as SellerListingsController;
use App\Http\Controllers\Seller\MessagesController as SellerMessagesController;
use App\Http\Controllers\Seller\TransactionsController as SellerTransactionsController;
use App\Http\Controllers\ChatController;

// Landing Page
Route::get('/', function () {
    return Inertia::render('LandingPage');
})->name('home');

// Authentication Routes
Route::get('/login', function () {
    return Inertia::render('auth/Login');
})->name('login');

Route::get('/register', function () {
    return Inertia::render('auth/Register');
})->name('register');

// Car Detail Page
Route::get('/car/{id}', function ($id) {
    return Inertia::render('CarDetail', ['carId' => $id]);
})->name('car.detail');

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
    // Dashboard
    Route::get('/', function () {
        return Inertia::render('admin/index');
    })->name('dashboard');

    // Users Management
    Route::prefix('users')->group(function () {
        Route::get('/admins', [AdminUsersController::class, 'admins'])->name('users.admins');
        Route::get('/sellers', [AdminUsersController::class, 'sellers'])->name('users.sellers');
        Route::get('/customers', [AdminUsersController::class, 'customers'])->name('users.customers');
        Route::patch('/toggle-status/{user}', [AdminUsersController::class, 'toggleStatus'])->name('users.toggle-status');
        Route::delete('/destroy/{user}', [AdminUsersController::class, 'destroy'])->name('users.destroy');
    });

    // Listings Management
    Route::prefix('listings')->group(function () {
        Route::get('/approval', [AdminListingsController::class, 'approval'])->name('listings.approval');
        Route::get('/all', [AdminListingsController::class, 'all'])->name('listings.all');
        Route::get('/media', [AdminListingsController::class, 'mediaReview'])->name('listings.media');
        Route::patch('/approve/{car}', [AdminListingsController::class, 'approveListing'])->name('listings.approve');
        Route::patch('/reject/{car}', [AdminListingsController::class, 'rejectListing'])->name('listings.reject');
        Route::patch('/flag-media/{car}', [AdminListingsController::class, 'flagMedia'])->name('listings.flag-media');
        Route::patch('/approve-media/{car}', [AdminListingsController::class, 'approveMedia'])->name('listings.approve-media');
    });

    // Commerce
    Route::prefix('commerce')->group(function () {
        Route::get('/subscriptions', [AdminCommerceController::class, 'subscriptions'])->name('commerce.subscriptions');
        Route::get('/payments', [AdminCommerceController::class, 'payments'])->name('commerce.payments');
        Route::get('/transactions', [AdminCommerceController::class, 'transactions'])->name('commerce.transactions');
        Route::get('/coupons', [AdminCommerceController::class, 'coupons'])->name('commerce.coupons');
        Route::post('/coupons', [AdminCommerceController::class, 'createCoupon'])->name('commerce.coupons.create');
        Route::patch('/coupons/{coupon}', [AdminCommerceController::class, 'updateCoupon'])->name('commerce.coupons.update');
        Route::patch('/coupons/{coupon}/toggle', [AdminCommerceController::class, 'toggleCoupon'])->name('commerce.coupons.toggle');
    });

    // Operations
    Route::prefix('operations')->group(function () {
        Route::get('/bookings', [AdminOperationsController::class, 'bookings'])->name('operations.bookings');
        Route::get('/disputes', [AdminOperationsController::class, 'disputes'])->name('operations.disputes');
        Route::get('/tickets', [AdminOperationsController::class, 'tickets'])->name('operations.tickets');
        Route::patch('/bookings/{booking}/status', [AdminOperationsController::class, 'updateBookingStatus'])->name('operations.bookings.status');
        Route::patch('/disputes/{dispute}/resolve', [AdminOperationsController::class, 'resolveDispute'])->name('operations.disputes.resolve');
        Route::patch('/tickets/{ticket}/assign', [AdminOperationsController::class, 'assignTicket'])->name('operations.tickets.assign');
    });

    // Catalog Setup
    Route::prefix('catalog')->group(function () {
        Route::get('/categories', [AdminCatalogController::class, 'categories'])->name('catalog.categories');
        Route::prefix('attributes')->group(function () {
            Route::get('/', [AdminCatalogController::class, 'attributes'])->name('catalog.attributes');
            Route::get('/body-type', [AdminCatalogController::class, 'bodyType'])->name('catalog.attributes.body-type');
            Route::get('/fuel', [AdminCatalogController::class, 'fuel'])->name('catalog.attributes.fuel');
            Route::get('/transmission', [AdminCatalogController::class, 'transmission'])->name('catalog.attributes.transmission');
            Route::get('/color', [AdminCatalogController::class, 'color'])->name('catalog.attributes.color');
            Route::get('/features', [AdminCatalogController::class, 'features'])->name('catalog.attributes.features');
            Route::post('/create', [AdminCatalogController::class, 'createAttribute'])->name('catalog.attributes.create');
            Route::patch('/{attribute}', [AdminCatalogController::class, 'updateAttribute'])->name('catalog.attributes.update');
            Route::delete('/{attribute}', [AdminCatalogController::class, 'deleteAttribute'])->name('catalog.attributes.delete');
        });
    });

    // Content Management
    Route::prefix('content')->group(function () {
        Route::get('/pages', function () {
            return Inertia::render('admin/content/Pages');
        })->name('content.pages');

        Route::get('/banners', function () {
            return Inertia::render('admin/content/Banners');
        })->name('content.banners');

        Route::get('/announcements', function () {
            return Inertia::render('admin/content/Announcements');
        })->name('content.announcements');
    });

    // Analytics
    Route::prefix('analytics')->group(function () {
        Route::get('/traffic', function () {
            return Inertia::render('admin/analytics/Traffic');
        })->name('analytics.traffic');

        Route::get('/revenue', function () {
            return Inertia::render('admin/analytics/Revenue');
        })->name('analytics.revenue');

        Route::get('/ai-insights', function () {
            return Inertia::render('admin/analytics/AIInsights');
        })->name('analytics.ai-insights');
    });

    // System
    Route::prefix('system')->group(function () {
        Route::get('/notifications', function () {
            return Inertia::render('admin/system/Notifications');
        })->name('system.notifications');

        Route::get('/feature-flags', function () {
            return Inertia::render('admin/system/FeatureFlags');
        })->name('system.feature-flags');

        Route::get('/audit-logs', function () {
            return Inertia::render('admin/system/AuditLogs');
        })->name('system.audit-logs');

        Route::get('/integrations', function () {
            return Inertia::render('admin/system/Integrations');
        })->name('system.integrations');

        Route::get('/settings', function () {
            return Inertia::render('admin/system/Settings');
        })->name('system.settings');
    });
});

// Seller Routes
Route::middleware(['auth', 'seller'])->prefix('seller')->name('seller.')->group(function () {
    // Dashboard
    Route::get('/', function () {
        return Inertia::render('seller/Dashboard');
    })->name('dashboard');

    // Car Listings Management
    Route::prefix('listings')->group(function () {
        Route::get('/add', [SellerListingsController::class, 'add'])->name('listings.add');
        Route::post('/store', [SellerListingsController::class, 'store'])->name('listings.store');
        Route::get('/active', [SellerListingsController::class, 'active'])->name('listings.active');
        Route::get('/pending', [SellerListingsController::class, 'pending'])->name('listings.pending');
        Route::get('/sold', [SellerListingsController::class, 'sold'])->name('listings.sold');
        Route::get('/{car}/edit', [SellerListingsController::class, 'edit'])->name('listings.edit');
        Route::patch('/{car}', [SellerListingsController::class, 'update'])->name('listings.update');
        Route::delete('/{car}', [SellerListingsController::class, 'destroy'])->name('listings.destroy');
        Route::patch('/{car}/mark-sold', [SellerListingsController::class, 'markAsSold'])->name('listings.mark-sold');
    });

    // Messages & Inquiries
    Route::prefix('messages')->group(function () {
        Route::get('/inbox', [SellerMessagesController::class, 'inbox'])->name('messages.inbox');
        Route::get('/{chatRoom}', [SellerMessagesController::class, 'show'])->name('messages.show');
        Route::post('/{chatRoom}/send', [SellerMessagesController::class, 'sendMessage'])->name('messages.send');
        Route::post('/private', [SellerMessagesController::class, 'createPrivateChat'])->name('messages.private');
    });

    // Transactions & Earnings
    Route::prefix('transactions')->group(function () {
        Route::get('/sales', [SellerTransactionsController::class, 'sales'])->name('transactions.sales');
        Route::get('/earnings', [SellerTransactionsController::class, 'earnings'])->name('transactions.earnings');
        Route::get('/payment-history', [SellerTransactionsController::class, 'paymentHistory'])->name('transactions.payment-history');
        Route::get('/commission-tracking', [SellerTransactionsController::class, 'commissionTracking'])->name('transactions.commission-tracking');
    });

    // Profile & Dealership Settings
    Route::prefix('profile')->group(function () {
        Route::get('/info', function () {
            return Inertia::render('seller/profile/DealerInfo');
        })->name('profile.info');

        Route::get('/verification', function () {
            return Inertia::render('seller/profile/Verification');
        })->name('profile.verification');
    });

    // Notifications & Alerts
    Route::get('/notifications', function () {
        return Inertia::render('seller/notifications/Notifications');
    })->name('notifications');

    // Reports & Analytics
    Route::prefix('analytics')->group(function () {
        Route::get('/performance', function () {
            return Inertia::render('seller/analytics/Performance');
        })->name('analytics.performance');

        Route::get('/trends', function () {
            return Inertia::render('seller/analytics/SalesTrends');
        })->name('analytics.trends');
    });
});



// Seller Pending Approval Route
Route::middleware(['auth'])->group(function () {
    Route::get('seller/pending-approval', [SellerDashboardController::class, 'pendingApproval'])->name('seller.pending-approval');
});

// Customer Routes
Route::prefix('customer')->group(function () {
    // Dashboard
    Route::get('/', function () {
        return Inertia::render('customer/Dashboard');
    })->name('customer.dashboard');

    // Car Browsing
    Route::get('/cars', function () {
        return Inertia::render('customer/CarListings');
    })->name('customer.cars');

    Route::get('/cars/{id}', function ($id) {
        return Inertia::render('customer/CarDetails', ['carId' => $id]);
    })->name('customer.car.details');

    // Wishlist & Saved
    Route::get('/favorites', function () {
        return Inertia::render('customer/Favorites');
    })->name('customer.favorites');

    Route::get('/recently-viewed', function () {
        return Inertia::render('customer/RecentlyViewed');
    })->name('customer.recently-viewed');

    Route::get('/saved-searches', function () {
        return Inertia::render('customer/SavedSearches');
    })->name('customer.saved-searches');

    // Compare Cars
    Route::get('/compare', function () {
        return Inertia::render('customer/CompareCars');
    })->name('customer.compare');

    // Bookings & Transactions
    Route::get('/bookings', function () {
        return Inertia::render('customer/Bookings');
    })->name('customer.bookings');

    Route::get('/transactions', function () {
        return Inertia::render('customer/Transactions');
    })->name('customer.transactions');

    // Profile & Settings
    Route::get('/profile', function () {
        return Inertia::render('customer/Profile');
    })->name('customer.profile');

    Route::get('/settings', function () {
        return Inertia::render('customer/Settings');
    })->name('customer.settings');

    // Notifications
    Route::get('/notifications', function () {
        return Inertia::render('customer/Notifications');
    })->name('customer.notifications');

    // Reviews
    Route::get('/reviews', function () {
        return Inertia::render('customer/Reviews');
    })->name('customer.reviews');

    // Support
    Route::get('/support', function () {
        return Inertia::render('customer/Support');
    })->name('customer.support');
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
