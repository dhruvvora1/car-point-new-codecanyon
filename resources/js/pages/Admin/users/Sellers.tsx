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
    Store, 
    MoreVertical, 
    Eye, 
    CheckCircle, 
    XCircle,
    Pause,
    Play,
    MessageSquare
} from 'lucide-react';

interface Seller {
    id: number;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    is_approved: boolean;
    is_active: boolean;
    cars_count: number;
    seller_profile?: {
        business_name?: string;
        business_type: string;
        city?: string;
        state?: string;
        is_verified: boolean;
    };
    created_at: string;
}

interface SellersProps {
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
        search?: string;
        status?: string;
        business_type?: string;
    };
}

export default function Sellers({ sellers, filters }: SellersProps) {
    const handleFilterChange = (newFilters: Record<string, any>) => {
        router.get(route('admin.users.sellers'), newFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePageChange = (page: number) => {
        router.get(route('admin.users.sellers'), { ...filters, page }, {
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

    const getStatusBadge = (seller: Seller) => {
        if (!seller.is_approved) {
            return <Badge variant="secondary">Pending Approval</Badge>;
        }
        if (!seller.is_active) {
            return <Badge variant="destructive">Suspended</Badge>;
        }
        return <Badge variant="default">Active</Badge>;
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
                    {row.seller_profile?.is_verified && (
                        <Badge variant="outline" className="mt-1">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                        </Badge>
                    )}
                </div>
            )
        },
        {
            key: 'status',
            label: 'Status',
            render: (value: any, row: Seller) => getStatusBadge(row)
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
                            <DropdownMenuItem>
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Send Message
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    ];

    return (
        <AppLayout>
            <Head title="Admin Users" />
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Users</h1>
                        <p className="text-gray-600">Manage administrator accounts and permissions</p>
                    </div>
                    <Link href={route('admin.users.create')}>
                        <Button>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add Admin
                        </Button>
                    </Link>
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
                    icon={Store}
                />
            </div>
        </AppLayout>
    );
}
