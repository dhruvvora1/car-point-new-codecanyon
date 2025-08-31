import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { 
    Clock, 
    CheckCircle, 
    XCircle,
    Eye,
    Car,
    User,
    MapPin,
    Calendar,
    DollarSign
} from 'lucide-react';

interface PendingCar {
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
    description: string;
    images: string[];
    seller: {
        id: number;
        name: string;
        email: string;
        seller_profile?: {
            business_name?: string;
            business_type: string;
        };
    };
    created_at: string;
}

interface ApprovalQueueProps {
    pendingCars: {
        data: PendingCar[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        search?: string;
    };
}

export default function ApprovalQueue({ pendingCars, filters }: ApprovalQueueProps) {
    const [selectedCar, setSelectedCar] = useState<PendingCar | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectDialog, setShowRejectDialog] = useState(false);

    const handleApprove = (carId: number) => {
        router.patch(route('admin.listings.approve', carId), {}, {
            onSuccess: () => {
                // Handle success
            }
        });
    };

    const handleReject = () => {
        if (!selectedCar || !rejectionReason.trim()) return;

        router.patch(route('admin.listings.reject', selectedCar.id), {
            reason: rejectionReason
        }, {
            onSuccess: () => {
                setShowRejectDialog(false);
                setRejectionReason('');
                setSelectedCar(null);
            }
        });
    };

    const handleSearch = (value: string) => {
        router.get(route('admin.listings.approval'), { search: value }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout>
            <Head title="Listing Approval Queue" />
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Listing Approval Queue</h1>
                        <p className="text-gray-600">Review and approve pending car listings</p>
                    </div>
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                        {pendingCars.total} Pending
                    </Badge>
                </div>

                {/* Search */}
                <Card>
                    <CardContent className="p-4">
                        <div className="relative max-w-md">
                            <Input
                                placeholder="Search by brand, model, or seller..."
                                value={filters.search || ''}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="pl-10"
                            />
                            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                    </CardContent>
                </Card>

                {/* Pending Cars Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {pendingCars.data.map((car) => (
                        <Card key={car.id} className="overflow-hidden">
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
                                <Badge className="absolute top-2 right-2">
                                    Pending Review
                                </Badge>
                            </div>
                            
                            <CardContent className="p-4">
                                <div className="space-y-3">
                                    <div>
                                        <h3 className="font-bold text-lg">
                                            {car.brand} {car.model} ({car.year})
                                        </h3>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <DollarSign className="h-4 w-4 mr-1" />
                                            {car.currency} {car.price.toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <span className="text-gray-500">Mileage:</span>
                                            <span className="ml-1 font-medium">{car.mileage.toLocaleString()} km</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Fuel:</span>
                                            <span className="ml-1 font-medium capitalize">{car.fuel_type}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Transmission:</span>
                                            <span className="ml-1 font-medium capitalize">{car.transmission}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Location:</span>
                                            <span className="ml-1 font-medium">{car.city}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center text-sm text-gray-600">
                                        <User className="h-4 w-4 mr-1" />
                                        {car.seller.name}
                                        {car.seller.seller_profile?.business_name && (
                                            <span className="ml-1">({car.seller.seller_profile.business_name})</span>
                                        )}
                                    </div>

                                    <div className="flex items-center text-sm text-gray-500">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        Submitted {new Date(car.created_at).toLocaleDateString()}
                                    </div>

                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {car.description}
                                    </p>
                                </div>
                            </CardContent>

                            <div className="p-4 bg-gray-50 flex items-center justify-between">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedCar(car)}
                                >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                </Button>
                                
                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedCar(car);
                                            setShowRejectDialog(true);
                                        }}
                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                    >
                                        <XCircle className="h-4 w-4 mr-1" />
                                        Reject
                                    </Button>
                                    
                                    <Button
                                        size="sm"
                                        onClick={() => handleApprove(car.id)}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        Approve
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {pendingCars.data.length === 0 && (
                    <Card>
                        <CardContent className="text-center py-12">
                            <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
                            <p className="text-gray-500">No pending listings to review at the moment.</p>
                        </CardContent>
                    </Card>
                )}

                {/* Rejection Dialog */}
                <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Reject Listing</DialogTitle>
                            <DialogDescription>
                                Please provide a reason for rejecting this listing. This will be sent to the seller.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                            <Textarea
                                placeholder="Enter rejection reason..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                rows={4}
                            />
                        </div>
                        
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                                Cancel
                            </Button>
                            <Button 
                                variant="destructive" 
                                onClick={handleReject}
                                disabled={!rejectionReason.trim()}
                            >
                                Reject Listing
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
