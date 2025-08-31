import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import DataTable from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
    CheckCircle, 
    XCircle, 
    Pause, 
    Play, 
    Eye, 
    MoreVertical,
    Trash2
} from 'lucide-react';

interface Seller {
    id: number;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    role: string;
    is_approved: boolean;
    is_active: boolean;
    cars_count: number;
    seller_profile?: {
        business_name?: string;
        business_type: string;
        city?: string;
        state?: string;
    };
    created_at: string;
}

interface SellersIndexProps {
    sellers: {
        data: Seller[];
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

export default function SellersIndex({ sellers, filters }: SellersIndexProps) {
    const handleFilterChange = (newFilters: Record<string, any>) => {
        router.get(route('admin.sellers.index'), newFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePageChange = (page: number) => {
        router.get(route('admin.sellers.index'), { ...filters, page }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleAction = (action: string, sellerId: number) => {
        const routeName = `admin.sellers.${action}`;
        router.patch(route(routeName, sellerId), {}, {
            onSuccess: () => {
                // Handle success
            }
        });
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const columns = [
        {
            key: 'seller',
            label: 'Seller',
            render: (value: any, row: Seller) => (
                <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={row.avatar} />
                        <AvatarFallback>{getInitials(row.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-medium text-gray-900">{row.name}</p>
                        <p className="text-sm text-gray-500">{row.email}</p>
                        {row.seller_profile?.business_name && (
                            <p className="text-xs text-gray-400">{row.seller_profile.business_name}</p>
                        )}
                    </div>
                </div>
            )
        },
        {
            key: 'business_info',
            label: 'Business Info',
            render: (value: any, row: Seller) => (
                <div>
                    <p className="text-sm font-medium">
                        {row.seller_profile?.business_type?.charAt(0).toUpperCase() + 
                         row.seller_profile?.business_type?.slice(1) || 'Individual'}
                    </p>
                    {row.seller_profile?.city && (
                        <p className="text-xs text-gray-500">
                            {row.seller_profile.city}, {row.seller_profile.state}
                        </p>
                    )}
                    {row.phone && (
                        <p className="text-xs text-gray-500">{row.phone}</p>
                    )}
                </div>
            )
        },
        {
            key: 'status',
            label: 'Status',
            render: (value: any, row: Seller) => (
                <div className="space-y-1">
                    <Badge variant={row.is_approved ? 'default' : 'secondary'}>
                        {row.is_approved ? 'Approved' : 'Pending'}
                    </Badge>
                    <br />
                    <Badge variant={row.is_active ? 'default' : 'destructive'}>
                        {row.is_active ? 'Active' : 'Suspended'}
                    </Badge>
                </div>
            )
        },
        {
            key: 'cars_count',
            label: 'Cars Listed',
            render: (value: number) => (
                <span className="font-medium text-blue-600">{value}</span>
            )
        },
        {
            key: 'created_at',
            label: 'Joined',
            render: (value: string) => (
                <span className="text-sm text-gray-600">
                    {new Date(value).toLocaleDateString()}
                </span>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (value: any, row: Seller) => (
                <div className="flex items-center space-x-2">
                    <Link href={route('admin.sellers.show', row.id)}>
                        <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </Link>
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {!row.is_approved && (
                                <DropdownMenuItem onClick={() => handleAction('approve', row.id)}>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve
                                </DropdownMenuItem>
                            )}
                            {row.is_approved && !row.is_active && (
                                <DropdownMenuItem onClick={() => handleAction('reactivate', row.id)}>
                                    <Play className="h-4 w-4 mr-2" />
                                    Reactivate
                                </DropdownMenuItem>
                            )}
                            {row.is_active && (
                                <DropdownMenuItem onClick={() => handleAction('suspend', row.id)}>
                                    <Pause className="h-4 w-4 mr-2" />
                                    Suspend
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleAction('reject', row.id)}>
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={() => handleAction('destroy', row.id)}
                                className="text-red-600"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    ];

    return (
        <AppLayout>
            <Head title="Manage Sellers" />
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manage Sellers</h1>
                        <p className="text-gray-600">Approve, manage, and monitor seller accounts</p>
                    </div>
                </div>

                <DataTable
                    data={sellers.data}
                    columns={columns}
                    pagination={sellers}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onPageChange={handlePageChange}
                    searchPlaceholder="Search sellers..."
                    title="Sellers"
                />
            </div>
        </AppLayout>
    );
}
