import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import StatsCard from '@/components/StatsCard';
import DataTable from '@/components/DataTable';
import CarCard from '@/components/CarCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    Users, 
    Car, 
    TrendingUp, 
    Star, 
    CheckCircle, 
    Clock, 
    XCircle,
    Eye,
    MessageSquare
} from 'lucide-react';
import { Link } from '@inertiajs/react';

interface DashboardProps {
    stats: {
        totalSellers: number;
        activeSellers: number;
        pendingSellers: number;
        totalCars: number;
        availableCars: number;
        soldCars: number;
        featuredCars: number;
    };
    monthlyData: Array<{
        month: string;
        sellers: number;
        cars: number;
        sales: number;
    }>;
    recentSellers: any[];
    recentCars: any[];
    topSellers: any[];
}

export default function AdminDashboard({ 
    stats, 
    monthlyData, 
    recentSellers, 
    recentCars, 
    topSellers 
}: DashboardProps) {
    const sellerColumns = [
        {
            key: 'name',
            label: 'Name',
            render: (value: string, row: any) => (
                <div className="flex items-center">
                    <div>
                        <p className="font-medium">{value}</p>
                        <p className="text-sm text-gray-500">{row.email}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'is_approved',
            label: 'Status',
            render: (value: boolean, row: any) => (
                <Badge variant={value ? 'default' : 'secondary'}>
                    {value ? 'Approved' : 'Pending'}
                </Badge>
            )
        },
        {
            key: 'cars_count',
            label: 'Cars Listed',
            render: (value: number) => (
                <span className="font-medium">{value}</span>
            )
        },
        {
            key: 'created_at',
            label: 'Joined',
            render: (value: string) => new Date(value).toLocaleDateString()
        },
    ];

    return (
        <AppLayout>
            <Head title="Admin Dashboard" />
            
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600">Welcome to CarPoint Admin Panel</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        title="Total Sellers"
                        value={stats.totalSellers}
                        description="Registered sellers"
                        icon={Users}
                        color="blue"
                    />
                    <StatsCard
                        title="Active Sellers"
                        value={stats.activeSellers}
                        description="Approved & active"
                        icon={CheckCircle}
                        color="green"
                    />
                    <StatsCard
                        title="Pending Approval"
                        value={stats.pendingSellers}
                        description="Awaiting approval"
                        icon={Clock}
                        color="yellow"
                    />
                    <StatsCard
                        title="Total Cars"
                        value={stats.totalCars}
                        description="All listings"
                        icon={Car}
                        color="purple"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        title="Available Cars"
                        value={stats.availableCars}
                        description="Ready for sale"
                        icon={Car}
                        color="green"
                    />
                    <StatsCard
                        title="Sold Cars"
                        value={stats.soldCars}
                        description="Successfully sold"
                        icon={TrendingUp}
                        color="blue"
                    />
                    <StatsCard
                        title="Featured Cars"
                        value={stats.featuredCars}
                        description="Premium listings"
                        icon={Star}
                        color="yellow"
                    />
                    <StatsCard
                        title="Quick Actions"
                        value=""
                        description="Manage platform"
                        icon={MessageSquare}
                        color="gray"
                    />
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Recent Sellers</CardTitle>
                            <Link href={route('admin.sellers.index')}>
                                <Button variant="outline" size="sm">View All</Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                data={recentSellers}
                                columns={sellerColumns}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Top Performing Sellers</CardTitle>
                            <Link href={route('admin.reports.sales')}>
                                <Button variant="outline" size="sm">View Reports</Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {topSellers.map((seller, index) => (
                                    <div key={seller.id} className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Badge variant="outline" className="mr-3">
                                                #{index + 1}
                                            </Badge>
                                            <div>
                                                <p className="font-medium">{seller.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {seller.cars_count} cars listed
                                                </p>
                                            </div>
                                        </div>
                                        <Link href={route('admin.sellers.show', seller.id)}>
                                            <Button variant="ghost" size="sm">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Cars */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Car Listings</CardTitle>
                        <Link href={route('admin.cars.index')}>
                            <Button variant="outline" size="sm">View All Cars</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recentCars.slice(0, 6).map((car) => (
                                <CarCard
                                    key={car.id}
                                    car={car}
                                    showSeller={true}
                                    href={route('admin.cars.show', car.id)}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="text-center">
                        <CardContent className="p-6">
                            <Users className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                            <h3 className="font-semibold mb-2">Manage Sellers</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Approve, suspend, or manage seller accounts
                            </p>
                            <Link href={route('admin.sellers.index')}>
                                <Button className="w-full">Manage Sellers</Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="text-center">
                        <CardContent className="p-6">
                            <Car className="h-12 w-12 mx-auto mb-4 text-green-500" />
                            <h3 className="font-semibold mb-2">Manage Cars</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                View, edit, or feature car listings
                            </p>
                            <Link href={route('admin.cars.index')}>
                                <Button className="w-full">Manage Cars</Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="text-center">
                        <CardContent className="p-6">
                            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-purple-500" />
                            <h3 className="font-semibold mb-2">View Reports</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Sales analytics and performance reports
                            </p>
                            <Link href={route('admin.reports.index')}>
                                <Button className="w-full">View Reports</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
