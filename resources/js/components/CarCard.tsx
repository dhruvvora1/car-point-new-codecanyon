import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Eye, MapPin, Calendar, Fuel, Settings, Star } from 'lucide-react';
import { Link } from '@inertiajs/react';

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
    seller?: {
        name: string;
        email: string;
    };
}

interface CarCardProps {
    car: Car;
    showSeller?: boolean;
    actions?: React.ReactNode;
    href?: string;
}

export default function CarCard({ car, showSeller = false, actions, href }: CarCardProps) {
    const statusColors = {
        available: 'bg-green-100 text-green-800',
        sold: 'bg-red-100 text-red-800',
        pending: 'bg-yellow-100 text-yellow-800',
    };

    const fuelTypeIcons = {
        petrol: '⛽',
        diesel: '🛢️',
        electric: '🔋',
        hybrid: '🔋⛽',
        cng: '💨',
    };

    const transmissionIcons = {
        manual: '🎛️',
        automatic: '⚙️',
        cvt: '🔄',
    };

    const CardWrapper = ({ children }: { children: React.ReactNode }) => {
        if (href) {
            return (
                <Link href={href} className="block">
                    {children}
                </Link>
            );
        }
        return <>{children}</>;
    };

    return (
        <CardWrapper>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="relative">
                    <img
                        src={car.images[0] || '/placeholder-car.jpg'}
                        alt={`${car.brand} ${car.model}`}
                        className="w-full h-48 object-cover"
                    />
                    {car.is_featured && (
                        <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                        </Badge>
                    )}
                    <Badge 
                        className={`absolute top-2 right-2 ${statusColors[car.status as keyof typeof statusColors]}`}
                    >
                        {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                    </Badge>
                </div>

                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="font-semibold text-lg text-gray-900">
                                {car.brand} {car.model}
                            </h3>
                            <p className="text-2xl font-bold text-blue-600">
                                {car.currency} {car.price.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-0">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            {car.year}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <Settings className="h-4 w-4 mr-2" />
                            {car.mileage.toLocaleString()} km
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <span className="mr-2">{fuelTypeIcons[car.fuel_type as keyof typeof fuelTypeIcons]}</span>
                            {car.fuel_type.charAt(0).toUpperCase() + car.fuel_type.slice(1)}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <span className="mr-2">{transmissionIcons[car.transmission as keyof typeof transmissionIcons]}</span>
                            {car.transmission.charAt(0).toUpperCase() + car.transmission.slice(1)}
                        </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-2" />
                        {car.city}, {car.state}
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                        <Eye className="h-4 w-4 mr-2" />
                        {car.views_count} views
                    </div>

                    {showSeller && car.seller && (
                        <div className="mt-3 pt-3 border-t">
                            <p className="text-sm text-gray-600">
                                Seller: <span className="font-medium">{car.seller.name}</span>
                            </p>
                        </div>
                    )}

                    <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                        {car.description}
                    </p>
                </CardContent>

                {actions && (
                    <CardFooter className="pt-0">
                        {actions}
                    </CardFooter>
                )}
            </Card>
        </CardWrapper>
    );
}
