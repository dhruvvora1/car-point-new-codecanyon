import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import StatsCard from '@/components/StatsCard';
import CarCard from '@/components/CarCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
    Car, 
    TrendingUp, 
    Eye, 
    MessageSquare, 
    Star,
    Plus,
    BarChart3,
    Settings
} from 'lucide-react';

interface SellerDashboardProps {
    stats: {
        totalCars: number;
        availableCars: number;
        soldCars: number;
        featuredCars: number;
        totalViews: number;
        totalInquiries: number;
        unreadMessages: number;
    };
    recentCars: any[];
    monthlyData: Array<{
        month: string;
        cars_added: number;
        cars_sold: number;
        views: number;
    }>;
    recentChats: any[];
}

export default function SellerDashboard({ 
    stats, 
    recentCars, 
    monthlyData, 
    recentChats 
}: SellerDashboardProps) {
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    return (
        <AppLayout>
            <Head title="Seller Dashboard" />
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
                        <p className="text-gray-600">Manage your car listings and track performance</p>
                    </div>
                    <Link href={route('seller.cars.create')}>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Car
                        </Button>
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        title="Total Cars"
                        value={stats.totalCars}
                        description="All your listings"
                        icon={Car}
                        color="blue"
                    />
                    <StatsCard
                        title="Available Cars"
                        value={stats.availableCars}
                        description="Ready for sale"
                        icon={Car}
                        color="green"
                    />
                    <StatsCard
                        title="Cars Sold"
                        value={stats.soldCars}
                        description="Successfully sold"
                        icon={TrendingUp}
                        color="purple"
                    />
                    <StatsCard
                        title="Featured Cars"
                        value={stats.featuredCars}
                        description="Premium listings"
                        icon={Star}
                        color="yellow"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatsCard
                        title="Total Views"
                        value={stats.totalViews}
                        description="All time views"
                        icon={Eye}
                        color="blue"
                    />
                    <StatsCard
                        title="Inquiries"
                        value={stats.totalInquiries}
                        description="Customer inquiries"
                        icon={MessageSquare}
                        color="green"
                    />
                    <StatsCard
                        title="Unread Messages"
                        value={stats.unreadMessages}
                        description="New chat messages"
                        icon={MessageSquare}
                        color="red"
                    />
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Recent Car Listings</CardTitle>
                            <Link href={route('seller.cars.index')}>
                                <Button variant="outline" size="sm">View All</Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentCars.slice(0, 3).map((car) => (
                                    <div key={car.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                                        <img
                                            src={car.images[0] || '/placeholder-car.jpg'}
                                            alt={`${car.brand} ${car.model}`}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-medium">{car.brand} {car.model}</h4>
                                            <p className="text-sm text-gray-600">
                                                {car.currency} {car.price.toLocaleString()}
                                            </p>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <Badge variant={car.status === 'available' ? 'default' : 'secondary'}>
                                                    {car.status}
                                                </Badge>
                                                {car.is_featured && (
                                                    <Badge variant="outline">
                                                        <Star className="h-3 w-3 mr-1" />
                                                        Featured
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">{car.views_count} views</p>
                                            <Link href={route('seller.cars.show', car.id)}>
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                                
                                {recentCars.length === 0 && (
                                    <div className="text-center py-8">
                                        <Car className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                        <p className="text-gray-500">No cars listed yet</p>
                                        <Link href={route('seller.cars.create')}>
                                            <Button className="mt-2">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Your First Car
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Recent Chat Activity</CardTitle>
                            <Link href={route('chat.index')}>
                                <Button variant="outline" size="sm">View All Chats</Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentChats.slice(0, 5).map((chat) => (
                                    <div key={chat.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                                        <div className="flex -space-x-2">
                                            {chat.participants.slice(0, 2).map((participant: any) => (
                                                <Avatar key={participant.id} className="h-8 w-8 border-2 border-white">
                                                    <AvatarImage src={participant.avatar} />
                                                    <AvatarFallback className="text-xs">
                                                        {getInitials(participant.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                            ))}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{chat.name}</p>
                                            {chat.latest_message && (
                                                <p className="text-xs text-gray-600 truncate">
                                                    {chat.latest_message.sender.name}: {chat.latest_message.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            {chat.latest_message && (
                                                <p className="text-xs text-gray-500">
                                                    {formatTime(chat.latest_message.created_at)}
                                                </p>
                                            )}
                                            <Link href={route('chat.show', chat.id)}>
                                                <Button variant="ghost" size="sm">
                                                    <MessageSquare className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                                
                                {recentChats.length === 0 && (
                                    <div className="text-center py-8">
                                        <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                        <p className="text-gray-500">No recent chat activity</p>
                                        <Link href={route('chat.group')}>
                                            <Button variant="outline" className="mt-2">
                                                Join Group Chat
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="text-center">
                        <CardContent className="p-6">
                            <Plus className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                            <h3 className="font-semibold mb-2">Add New Car</h3>
                            <p className="text-sm text-gray-600 mb-4">List a new car for sale</p>
                            <Link href={route('seller.cars.create')}>
                                <Button className="w-full">Add Car</Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="text-center">
                        <CardContent className="p-6">
                            <Car className="h-12 w-12 mx-auto mb-4 text-green-500" />
                            <h3 className="font-semibold mb-2">Manage Cars</h3>
                            <p className="text-sm text-gray-600 mb-4">View and edit your listings</p>
                            <Link href={route('seller.cars.index')}>
                                <Button className="w-full">Manage Cars</Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="text-center">
                        <CardContent className="p-6">
                            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-purple-500" />
                            <h3 className="font-semibold mb-2">Chat</h3>
                            <p className="text-sm text-gray-600 mb-4">Connect with other sellers</p>
                            <Link href={route('chat.index')}>
                                <Button className="w-full">Open Chat</Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="text-center">
                        <CardContent className="p-6">
                            <Settings className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                            <h3 className="font-semibold mb-2">Profile</h3>
                            <p className="text-sm text-gray-600 mb-4">Update your information</p>
                            <Link href={route('seller.profile.show')}>
                                <Button className="w-full">Edit Profile</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
