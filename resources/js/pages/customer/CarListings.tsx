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
    Heart,
    Eye,
    MapPin,
    Calendar,
    Fuel,
    Settings,
    SlidersHorizontal
} from 'lucide-react';

interface Car {
    id: number;
    brand: string;
    model: string;
    year: number;
    price: number;
    currency: string;
    mileage: number;
    fuel_type: string;
    transmission: string;
    location: string;
    city: string;
    state: string;
    images: string[];
    is_featured: boolean;
    views_count: number;
    seller: {
        id: number;
        name: string;
        seller_profile?: {
            business_name?: string;
            is_verified: boolean;
        };
    };
    created_at: string;
}

interface CarListingsProps {
    cars: {
        data: Car[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        search?: string;
        brand?: string;
        fuel_type?: string;
        transmission?: string;
        min_price?: number;
        max_price?: number;
        min_year?: number;
        max_year?: number;
        city?: string;
        sort?: string;
    };
    brands: string[];
    cities: string[];
}

export default function CarListings({ cars, filters, brands, cities }: CarListingsProps) {
    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value, page: 1 };
        if (!value || value === 'all') {
            delete newFilters[key];
        }
        
        router.get(route('customer.cars'), newFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePageChange = (page: number) => {
        router.get(route('customer.cars'), { ...filters, page }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleAddToFavorites = (carId: number) => {
        router.post(route('customer.favorites.add'), { car_id: carId }, {
            preserveState: true,
        });
    };

    return (
        <AppLayout>
            <Head title="Browse Cars" />
            
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Browse Cars</h1>
                    <p className="text-gray-600">Find your perfect car from our extensive collection</p>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <SlidersHorizontal className="h-5 w-5 mr-2" />
                            Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                            {/* Search */}
                            <div className="col-span-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search by brand, model..."
                                        value={filters.search || ''}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Brand Filter */}
                            <Select
                                value={filters.brand || 'all'}
                                onValueChange={(value) => handleFilterChange('brand', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Brand" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Brands</SelectItem>
                                    {brands.map((brand) => (
                                        <SelectItem key={brand} value={brand}>
                                            {brand}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Fuel Type Filter */}
                            <Select
                                value={filters.fuel_type || 'all'}
                                onValueChange={(value) => handleFilterChange('fuel_type', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Fuel Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Fuel Types</SelectItem>
                                    <SelectItem value="petrol">Petrol</SelectItem>
                                    <SelectItem value="diesel">Diesel</SelectItem>
                                    <SelectItem value="electric">Electric</SelectItem>
                                    <SelectItem value="hybrid">Hybrid</SelectItem>
                                    <SelectItem value="cng">CNG</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* City Filter */}
                            <Select
                                value={filters.city || 'all'}
                                onValueChange={(value) => handleFilterChange('city', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="City" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Cities</SelectItem>
                                    {cities.map((city) => (
                                        <SelectItem key={city} value={city}>
                                            {city}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Sort */}
                            <Select
                                value={filters.sort || 'latest'}
                                onValueChange={(value) => handleFilterChange('sort', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="latest">Latest First</SelectItem>
                                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                                    <SelectItem value="year_new">Year: Newest First</SelectItem>
                                    <SelectItem value="mileage_low">Mileage: Low to High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Results */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                            {cars.total} cars found
                        </Badge>
                        {Object.keys(filters).length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.get(route('customer.cars'))}
                            >
                                Clear Filters
                            </Button>
                        )}
                    </div>
                </div>

                {/* Car Grid */}
                {cars.data.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-12">
                            <Search className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No cars found</h3>
                            <p className="text-gray-500">Try adjusting your search criteria or browse all cars.</p>
                            <Button 
                                className="mt-4"
                                onClick={() => router.get(route('customer.cars'))}
                            >
                                Browse All Cars
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {cars.data.map((car) => (
                            <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="aspect-video relative">
                                    {car.images?.[0] ? (
                                        <img
                                            src={car.images[0]}
                                            alt={`${car.brand} ${car.model}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <Car className="h-12 w-12 text-gray-400" />
                                        </div>
                                    )}
                                    
                                    {car.is_featured && (
                                        <Badge className="absolute top-2 left-2 bg-yellow-500">
                                            Featured
                                        </Badge>
                                    )}
                                    
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                                        onClick={() => handleAddToFavorites(car.id)}
                                    >
                                        <Heart className="h-4 w-4" />
                                    </Button>
                                </div>
                                
                                <CardContent className="p-4">
                                    <div className="space-y-2">
                                        <h3 className="font-bold text-lg">
                                            {car.brand} {car.model} ({car.year})
                                        </h3>
                                        
                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-bold text-blue-600">
                                                {car.currency} {car.price.toLocaleString()}
                                            </span>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Eye className="h-4 w-4 mr-1" />
                                                {car.views_count}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <Settings className="h-4 w-4 mr-1" />
                                                {car.mileage.toLocaleString()} km
                                            </div>
                                            <div className="flex items-center">
                                                <Fuel className="h-4 w-4 mr-1" />
                                                {car.fuel_type}
                                            </div>
                                        </div>

                                        <div className="flex items-center text-sm text-gray-500">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            {car.city}, {car.state}
                                        </div>

                                        <div className="flex items-center text-sm text-gray-500">
                                            <span>By {car.seller.seller_profile?.business_name || car.seller.name}</span>
                                            {car.seller.seller_profile?.is_verified && (
                                                <Badge variant="outline" className="ml-2">
                                                    Verified
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                                
                                <div className="p-4 bg-gray-50 flex space-x-2">
                                    <Link href={route('customer.car.details', car.id)} className="flex-1">
                                        <Button className="w-full">
                                            <Eye className="h-4 w-4 mr-2" />
                                            View Details
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleAddToFavorites(car.id)}
                                    >
                                        <Heart className="h-4 w-4" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {cars.last_page > 1 && (
                    <div className="flex justify-center">
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => handlePageChange(cars.current_page - 1)}
                                disabled={cars.current_page <= 1}
                            >
                                Previous
                            </Button>
                            
                            <span className="text-sm text-gray-600">
                                Page {cars.current_page} of {cars.last_page}
                            </span>
                            
                            <Button
                                variant="outline"
                                onClick={() => handlePageChange(cars.current_page + 1)}
                                disabled={cars.current_page >= cars.last_page}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
