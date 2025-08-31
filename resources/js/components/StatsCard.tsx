import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon?: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
}

export default function StatsCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    color = 'blue'
}: StatsCardProps) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600 border-blue-200',
        green: 'bg-green-50 text-green-600 border-green-200',
        yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
        red: 'bg-red-50 text-red-600 border-red-200',
        purple: 'bg-purple-50 text-purple-600 border-purple-200',
        gray: 'bg-gray-50 text-gray-600 border-gray-200',
    };

    const iconColorClasses = {
        blue: 'text-blue-500',
        green: 'text-green-500',
        yellow: 'text-yellow-500',
        red: 'text-red-500',
        purple: 'text-purple-500',
        gray: 'text-gray-500',
    };

    return (
        <Card className={`${colorClasses[color]} border`}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-1">
                            {title}
                        </p>
                        <p className="text-3xl font-bold text-gray-900">
                            {typeof value === 'number' ? value.toLocaleString() : value}
                        </p>
                        {description && (
                            <p className="text-sm text-gray-500 mt-1">
                                {description}
                            </p>
                        )}
                        {trend && (
                            <div className="flex items-center mt-2">
                                <Badge 
                                    variant={trend.isPositive ? "default" : "destructive"}
                                    className="text-xs"
                                >
                                    {trend.isPositive ? '+' : ''}{trend.value}%
                                </Badge>
                                <span className="text-xs text-gray-500 ml-2">
                                    vs last period
                                </span>
                            </div>
                        )}
                    </div>
                    {Icon && (
                        <div className={`p-3 rounded-full ${iconColorClasses[color]} bg-white/50`}>
                            <Icon className="h-6 w-6" />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
