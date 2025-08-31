import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';

interface Column {
    key: string;
    label: string;
    sortable?: boolean;
    render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
    data: any[];
    columns: Column[];
    pagination?: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters?: Record<string, any>;
    onFilterChange?: (filters: Record<string, any>) => void;
    onPageChange?: (page: number) => void;
    searchPlaceholder?: string;
    title?: string;
    actions?: React.ReactNode;
}

export default function DataTable({
    data,
    columns,
    pagination,
    filters = {},
    onFilterChange,
    onPageChange,
    searchPlaceholder = "Search...",
    title,
    actions
}: DataTableProps) {
    const handleSearchChange = (value: string) => {
        onFilterChange?.({ ...filters, search: value });
    };

    const handleFilterChange = (key: string, value: string) => {
        onFilterChange?.({ ...filters, [key]: value });
    };

    const renderPagination = () => {
        if (!pagination || pagination.last_page <= 1) return null;

        const pages = [];
        const maxPages = 5;
        let startPage = Math.max(1, pagination.current_page - Math.floor(maxPages / 2));
        let endPage = Math.min(pagination.last_page, startPage + maxPages - 1);

        if (endPage - startPage + 1 < maxPages) {
            startPage = Math.max(1, endPage - maxPages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return (
            <div className="flex items-center justify-between px-6 py-4 border-t">
                <div className="text-sm text-gray-600">
                    Showing {pagination.from} to {pagination.to} of {pagination.total} results
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange?.(pagination.current_page - 1)}
                        disabled={pagination.current_page <= 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    
                    {pages.map(page => (
                        <Button
                            key={page}
                            variant={page === pagination.current_page ? "default" : "outline"}
                            size="sm"
                            onClick={() => onPageChange?.(page)}
                        >
                            {page}
                        </Button>
                    ))}
                    
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange?.(pagination.current_page + 1)}
                        disabled={pagination.current_page >= pagination.last_page}
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>{title}</CardTitle>
                    {actions}
                </div>
                
                {/* Search and Filters */}
                <div className="flex items-center space-x-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder={searchPlaceholder}
                            value={filters.search || ''}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
            </CardHeader>
            
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={column.key}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {column.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    {columns.map((column) => (
                                        <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm">
                                            {column.render 
                                                ? column.render(row[column.key], row)
                                                : row[column.key]
                                            }
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {data.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No data found</p>
                        </div>
                    )}
                </div>
                
                {renderPagination()}
            </CardContent>
        </Card>
    );
}
