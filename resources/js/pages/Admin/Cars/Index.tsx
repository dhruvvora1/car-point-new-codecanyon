import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import CarCard from '@/components/CarCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
    Search, 
    Filter, 
    Star, 
    Eye, 
    Edit, 
    Trash2,
    MoreVertical
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
    seller: {
        id: number;
        name: string;
        email: string;
    };
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
        brand?: string;
        seller?: string;
        price_min?: string;
        price_max?: string;
        featured?: string;
        search?: string;
    };
    brands: string[];
    sellers: Array<{ id: number; name: string; email: string; }>;
}

export default function CarsIndex({ cars, filters, brands, sellers }: CarsIndexProps) {
    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value };
        if (!value) {
            delete newFilters[key];
        }
        
        router.get(route('admin.cars.index'), newFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePageChange = (page: number) => {
        router.get(route('admin.cars.index'), { ...filters, page }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleToggleFeatured = (carId: number) => {
        router.patch(route('admin.cars.toggle-featured', carId), {}, {
            preserveState: true,
        });
    };

    const handleDelete = (carId: number) => {
        if (confirm('Are you sure you want to delete this car listing?')) {
            router.delete(route('admin.cars.destroy', carId));
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
            <Head title="Manage Cars" />
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manage Cars</h1>
                        <p className="text-gray-600">View, edit, and manage all car listings</p>
                    </div>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search cars..."
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
                            
                            <Select value={filters.brand || ''} onValueChange={(value) => handleFilterChange('brand', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Brands" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Brands</SelectItem>
                                    {brands.map(brand => (
                                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            
                            <Select value={filters.featured || ''} onValueChange={(value) => handleFilterChange('featured', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Featured Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Cars</SelectItem>
                                    <SelectItem value="true">Featured Only</SelectItem>
                                    <SelectItem value="false">Non-Featured</SelectItem>
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
                            showSeller={true}
                            actions={
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Link href={route('admin.cars.show', car.id)}>
                                            <Button variant="outline" size="sm">
                                                <Eye className="h-4 w-4 mr-1" />
                                                View
                                            </Button>
                                        </Link>
                                        <Link href={route('admin.cars.edit', car.id)}>
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
                                            <DropdownMenuItem onClick={() => handleToggleFeatured(car.id)}>
                                                <Star className="h-4 w-4 mr-2" />
                                                {car.is_featured ? 'Remove Featured' : 'Make Featured'}
                                            </DropdownMenuItem>
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
                            <p className="text-gray-500">No cars found matching your criteria</p>
                        </CardContent>
                    </Card>
                )}

                {renderPagination()}
            </div>
        </AppLayout>
    );
}
