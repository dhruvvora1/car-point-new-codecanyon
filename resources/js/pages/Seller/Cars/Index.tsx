import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import CarCard from '@/components/CarCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    Plus, 
    Search, 
    Filter, 
    Eye, 
    Edit, 
    Trash2,
    MoreVertical,
    CheckCircle
} from 'lucide-react';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface Car {
    id: number;
    brand: string;
    model: string;
    year: number;
    mileage: number;
    fuel_type: string;
    transmission: string;
    price: number;
    currency: string;
    location: string;
    city: string;
    state: string;
    description: string;
    images: string[];
    status: string;
    is_featured: boolean;
    views_count: number;
    inquiries_count: number;
}

interface CarsIndexProps {
    cars: {
        data: Car[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters: {
        status?: string;
        search?: string;
    };
}

export default function SellerCarsIndex({ cars, filters }: CarsIndexProps) {
    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value };
        if (!value) {
            delete newFilters[key];
        }
        
        router.get(route('seller.cars.index'), newFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePageChange = (page: number) => {
        router.get(route('seller.cars.index'), { ...filters, page }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleMarkAsSold = (carId: number) => {
        if (confirm('Are you sure you want to mark this car as sold?')) {
            router.patch(route('seller.cars.mark-sold', carId), {}, {
                preserveState: true,
            });
        }
    };

    const handleDelete = (carId: number) => {
        if (confirm('Are you sure you want to delete this car listing?')) {
            router.delete(route('seller.cars.destroy', carId));
        }
    };

    const renderPagination = () => {
        if (!cars || cars.last_page <= 1) return null;

        const pages = [];
        const maxPages = 5;
        let startPage = Math.max(1, cars.current_page - Math.floor(maxPages / 2));
        let endPage = Math.min(cars.last_page, startPage + maxPages - 1);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return (
            <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600">
                    Showing {cars.from} to {cars.to} of {cars.total} results
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(cars.current_page - 1)}
                        disabled={cars.current_page <= 1}
                    >
                        Previous
                    </Button>
                    
                    {pages.map(page => (
                        <Button
                            key={page}
                            variant={page === cars.current_page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </Button>
                    ))}
                    
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(cars.current_page + 1)}
                        disabled={cars.current_page >= cars.last_page}
                    >
                        Next
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <AppLayout>
            <Head title="My Cars" />
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Cars</h1>
                        <p className="text-gray-600">Manage your car listings</p>
                    </div>
                    <Link href={route('seller.cars.create')}>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Car
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Filter className="h-5 w-5 mr-2" />
                            Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search your cars..."
                                    value={filters.search || ''}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            
                            <Select value={filters.status || ''} onValueChange={(value) => handleFilterChange('status', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Status</SelectItem>
                                    <SelectItem value="available">Available</SelectItem>
                                    <SelectItem value="sold">Sold</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Cars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cars.data.map((car) => (
                        <CarCard
                            key={car.id}
                            car={car}
                            actions={
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Link href={route('seller.cars.show', car.id)}>
                                            <Button variant="outline" size="sm">
                                                <Eye className="h-4 w-4 mr-1" />
                                                View
                                            </Button>
                                        </Link>
                                        <Link href={route('seller.cars.edit', car.id)}>
                                            <Button variant="outline" size="sm">
                                                <Edit className="h-4 w-4 mr-1" />
                                                Edit
                                            </Button>
                                        </Link>
                                    </div>
                                    
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            {car.status === 'available' && (
                                                <DropdownMenuItem onClick={() => handleMarkAsSold(car.id)}>
                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                    Mark as Sold
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem 
                                                onClick={() => handleDelete(car.id)}
                                                className="text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            }
                        />
                    ))}
                </div>

                {cars.data.length === 0 && (
                    <Card>
                        <CardContent className="text-center py-12">
                            <Car className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No cars listed yet</h3>
                            <p className="text-gray-500 mb-4">Start by adding your first car listing</p>
                            <Link href={route('seller.cars.create')}>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Your First Car
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}

                {renderPagination()}
            </div>
        </AppLayout>
    );
}
