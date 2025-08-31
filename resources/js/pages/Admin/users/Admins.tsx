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
    Shield, 
    MoreVertical, 
    Eye, 
    Edit, 
    Trash2,
    UserPlus,
    Power,
    PowerOff
} from 'lucide-react';

interface Admin {
    id: number;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    is_active: boolean;
    cars_count: number;
    created_at: string;
    last_login_at?: string;
}

interface AdminsProps {
    admins: {
        data: Admin[];
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
    };
}

export default function Admins({ admins, filters }: AdminsProps) {
    const handleFilterChange = (newFilters: Record<string, any>) => {
        router.get(route('admin.users.admins'), newFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePageChange = (page: number) => {
        router.get(route('admin.users.admins'), { ...filters, page }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleToggleStatus = (adminId: number) => {
        router.patch(route('admin.users.toggle-status', adminId), {}, {
            onSuccess: () => {
                // Handle success
            }
        });
    };

    const handleDelete = (adminId: number) => {
        if (confirm('Are you sure you want to delete this admin? This action cannot be undone.')) {
            router.delete(route('admin.users.destroy', adminId));
        }
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const columns = [
        {
            key: 'admin',
            label: 'Admin',
            render: (value: any, row: Admin) => (
                <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={row.avatar} />
                        <AvatarFallback>{getInitials(row.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-medium text-gray-900">{row.name}</p>
                        <p className="text-sm text-gray-500">{row.email}</p>
                        {row.phone && (
                            <p className="text-xs text-gray-400">{row.phone}</p>
                        )}
                    </div>
                </div>
            )
        },
        {
            key: 'status',
            label: 'Status',
            render: (value: any, row: Admin) => (
                <Badge variant={row.is_active ? 'default' : 'destructive'}>
                    {row.is_active ? 'Active' : 'Inactive'}
                </Badge>
            )
        },
        {
            key: 'last_login_at',
            label: 'Last Login',
            render: (value: string) => (
                <span className="text-sm text-gray-600">
                    {value ? new Date(value).toLocaleDateString() : 'Never'}
                </span>
            )
        },
        {
            key: 'created_at',
            label: 'Created',
            render: (value: string) => (
                <span className="text-sm text-gray-600">
                    {new Date(value).toLocaleDateString()}
                </span>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (value: any, row: Admin) => (
                <div className="flex items-center space-x-2">
                    <Link href={route('admin.users.show', row.id)}>
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
                            <DropdownMenuItem onClick={() => handleToggleStatus(row.id)}>
                                {row.is_active ? (
                                    <>
                                        <PowerOff className="h-4 w-4 mr-2" />
                                        Deactivate
                                    </>
                                ) : (
                                    <>
                                        <Power className="h-4 w-4 mr-2" />
                                        Activate
                                    </>
                                )}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={() => handleDelete(row.id)}
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
            <Head title="Admin Users" />
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Users</h1>
                        <p className="text-gray-600">Manage administrator accounts</p>
                    </div>
                    <Link href={route('admin.users.create')}>
                        <Button>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add Admin
                        </Button>
                    </Link>
                </div>

                <DataTable
                    data={admins.data}
                    columns={columns}
                    pagination={admins}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onPageChange={handlePageChange}
                    searchPlaceholder="Search admins..."
                    title="Administrators"
                    icon={Shield}
                />
            </div>
        </AppLayout>
    );
}
