import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Users, 
    Car, 
    DollarSign, 
    TrendingUp,
    Store,
    UserCheck,
    Clock,
    AlertTriangle,
    MessageSquare,
    Settings,
    BarChart3,
    FileText
} from 'lucide-react';

interface DashboardStats {
    totalUsers: number;
    totalSellers: number;
    pendingSellers: number;
    totalCars: number;
    pendingCars: number;
    totalRevenue: number;
    monthlyRevenue: number;
    activeChats: number;
}

interface AdminDashboardProps {
    stats?: DashboardStats;
}

export default function AdminDashboard({ stats }: AdminDashboardProps) {
    const defaultStats = {
        totalUsers: 0,
        totalSellers: 0,
        pendingSellers: 0,
        totalCars: 0,
        pendingCars: 0,
        totalRevenue: 0,
        monthlyRevenue: 0,
        activeChats: 0,
        ...stats
    };

    const quickActions = [
        {
            title: 'Approve Sellers',
            description: 'Review pending seller applications',
            href: route('admin.users.sellers', { status: 'pending' }),
            icon: UserCheck,
            color: 'bg-blue-500',
            count: defaultStats.pendingSellers
        },
        {
            title: 'Review Listings',
            description: 'Approve pending car listings',
            href: route('admin.listings.approval'),
            icon: Clock,
            color: 'bg-orange-500',
            count: defaultStats.pendingCars
        },
        {
            title: 'Active Chats',
            description: 'Monitor ongoing conversations',
            href: route('chat.index'),
            icon: MessageSquare,
            color: 'bg-green-500',
            count: defaultStats.activeChats
        },
        {
            title: 'System Settings',
            description: 'Configure platform settings',
            href: route('admin.system.settings'),
            icon: Settings,
            color: 'bg-purple-500',
            count: null
        }
    ];

    const managementSections = [
        {
            title: 'User Management',
            items: [
                { name: 'Administrators', href: route('admin.users.admins'), icon: Users },
                { name: 'Sellers', href: route('admin.users.sellers'), icon: Store },
                { name: 'Customers', href: route('admin.users.customers'), icon: Users },
            ]
        },
        {
            title: 'Listings & Catalog',
            items: [
                { name: 'Approval Queue', href: route('admin.listings.approval'), icon: Clock },
                { name: 'All Listings', href: route('admin.listings.all'), icon: Car },
                { name: 'Categories', href: route('admin.catalog.categories'), icon: FileText },
                { name: 'Attributes', href: route('admin.catalog.attributes'), icon: Settings },
            ]
        },
        {
            title: 'Commerce & Finance',
            items: [
                { name: 'Transactions', href: route('admin.commerce.transactions'), icon: DollarSign },
                { name: 'Subscriptions', href: route('admin.commerce.subscriptions'), icon: TrendingUp },
                { name: 'Payments', href: route('admin.commerce.payments'), icon: DollarSign },
                { name: 'Coupons', href: route('admin.commerce.coupons'), icon: Badge },
            ]
        },
        {
            title: 'Operations',
            items: [
                { name: 'Bookings', href: route('admin.operations.bookings'), icon: Clock },
                { name: 'Disputes', href: route('admin.operations.disputes'), icon: AlertTriangle },
                { name: 'Support Tickets', href: route('admin.operations.tickets'), icon: MessageSquare },
            ]
        }
    ];

    return (
        <AppLayout>
            <Head title="Admin Dashboard" />
            
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600">Welcome back! Here's what's happening on your platform.</p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Users className="h-8 w-8 text-blue-500" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                                    <p className="text-2xl font-bold">{defaultStats.totalUsers}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Store className="h-8 w-8 text-green-500" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Active Sellers</p>
                                    <p className="text-2xl font-bold">{defaultStats.totalSellers}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Car className="h-8 w-8 text-purple-500" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Cars</p>
                                    <p className="text-2xl font-bold">{defaultStats.totalCars}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <DollarSign className="h-8 w-8 text-yellow-500" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                                    <p className="text-2xl font-bold">₹{defaultStats.monthlyRevenue.toLocaleString()}</p>
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
                                                {action.count !== null && action.count > 0 && (
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

                {/* Management Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {managementSections.map((section, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <CardTitle>{section.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {section.items.map((item, itemIndex) => (
                                        <Link key={itemIndex} href={item.href}>
                                            <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                                <item.icon className="h-5 w-5 text-gray-400 mr-3" />
                                                <span className="font-medium text-gray-700">{item.name}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
