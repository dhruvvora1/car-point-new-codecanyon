import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Car, 
    Heart, 
    Search,
    Clock,
    MessageSquare,
    Star,
    TrendingUp,
    Bookmark,
    Eye
} from 'lucide-react';

interface CustomerStats {
    favoriteListings: number;
    recentlyViewed: number;
    savedSearches: number;
    activeBookings: number;
    completedBookings: number;
    totalSpent: number;
}

interface CustomerDashboardProps {
    stats?: CustomerStats;
    recentlyViewed?: any[];
    favoriteListings?: any[];
    recommendations?: any[];
}

export default function CustomerDashboard({ 
    stats, 
    recentlyViewed = [], 
    favoriteListings = [],
    recommendations = []
}: CustomerDashboardProps) {
    const defaultStats = {
        favoriteListings: 0,
        recentlyViewed: 0,
        savedSearches: 0,
        activeBookings: 0,
        completedBookings: 0,
        totalSpent: 0,
        ...stats
    };

    const quickActions = [
        {
            title: 'Browse Cars',
            description: 'Explore available vehicles',
            href: route('customer.cars'),
            icon: Search,
            color: 'bg-blue-500'
        },
        {
            title: 'My Favorites',
            description: 'View saved listings',
            href: route('customer.favorites'),
            icon: Heart,
            color: 'bg-red-500',
            count: defaultStats.favoriteListings
        },
        {
            title: 'Compare Cars',
            description: 'Compare selected vehicles',
            href: route('customer.compare'),
            icon: TrendingUp,
            color: 'bg-green-500'
        },
        {
            title: 'My Bookings',
            description: 'View test drives & inspections',
            href: route('customer.bookings'),
            icon: Clock,
            color: 'bg-purple-500',
            count: defaultStats.activeBookings
        }
    ];

    return (
        <AppLayout>
            <Head title="Customer Dashboard" />
            
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
                    <p className="text-gray-600">Find your perfect car from our extensive collection.</p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Heart className="h-8 w-8 text-red-500" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Favorite Cars</p>
                                    <p className="text-2xl font-bold">{defaultStats.favoriteListings}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Eye className="h-8 w-8 text-blue-500" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Recently Viewed</p>
                                    <p className="text-2xl font-bold">{defaultStats.recentlyViewed}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Clock className="h-8 w-8 text-orange-500" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Active Bookings</p>
                                    <p className="text-2xl font-bold">{defaultStats.activeBookings}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Bookmark className="h-8 w-8 text-green-500" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Saved Searches</p>
                                    <p className="text-2xl font-bold">{defaultStats.savedSearches}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {quickActions.map((action, index) => (
                                <Link key={index} href={action.href}>
                                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                        <CardContent className="p-4">
                                            <div className="flex items-center">
                                                <div className={`p-2 rounded-lg ${action.color}`}>
                                                    <action.icon className="h-5 w-5 text-white" />
                                                </div>
                                                <div className="ml-3 flex-1">
                                                    <p className="font-medium text-gray-900">{action.title}</p>
                                                    <p className="text-sm text-gray-500">{action.description}</p>
                                                </div>
                                                {action.count && action.count > 0 && (
                                                    <Badge variant="destructive">{action.count}</Badge>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Recently Viewed Cars</CardTitle>
                            <Link href={route('customer.recently-viewed')}>
                                <Button variant="outline" size="sm">View All</Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {recentlyViewed.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <Car className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                    <p>No cars viewed yet</p>
                                    <Link href={route('customer.cars')}>
                                        <Button className="mt-2">Browse Cars</Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {recentlyViewed.slice(0, 5).map((car) => (
                                        <Link key={car.id} href={route('customer.car.details', car.id)}>
                                            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                                <div className="flex items-center">
                                                    {car.images?.[0] && (
                                                        <img 
                                                            src={car.images[0]} 
                                                            alt={`${car.brand} ${car.model}`}
                                                            className="w-12 h-12 object-cover rounded mr-3"
                                                        />
                                                    )}
                                                    <div>
                                                        <p className="font-medium">{car.brand} {car.model}</p>
                                                        <p className="text-sm text-gray-500">₹{car.price.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(car.viewed_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Recommended for You</CardTitle>
                            <Link href={route('customer.cars')}>
                                <Button variant="outline" size="sm">Browse More</Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {recommendations.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                    <p>No recommendations yet</p>
                                    <p className="text-sm">Browse cars to get personalized recommendations</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {recommendations.slice(0, 5).map((car) => (
                                        <Link key={car.id} href={route('customer.car.details', car.id)}>
                                            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                                <div className="flex items-center">
                                                    {car.images?.[0] && (
                                                        <img 
                                                            src={car.images[0]} 
                                                            alt={`${car.brand} ${car.model}`}
                                                            className="w-12 h-12 object-cover rounded mr-3"
                                                        />
                                                    )}
                                                    <div>
                                                        <p className="font-medium">{car.brand} {car.model}</p>
                                                        <p className="text-sm text-gray-500">₹{car.price.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <Badge variant="outline">Recommended</Badge>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
