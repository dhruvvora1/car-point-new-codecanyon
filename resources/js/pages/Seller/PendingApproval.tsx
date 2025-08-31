import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Clock, 
    CheckCircle, 
    User, 
    Mail, 
    Phone,
    AlertCircle
} from 'lucide-react';

export default function PendingApproval() {
    const user = auth().user;

    return (
        <AppLayout>
            <Head title="Pending Approval" />
            
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                        <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Pending Approval</h1>
                    <p className="text-gray-600">
                        Your seller account is currently under review by our admin team.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <AlertCircle className="h-5 w-5 mr-2 text-yellow-500" />
                            What's Next?
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs font-medium text-blue-600">1</span>
                                </div>
                                <div>
                                    <h4 className="font-medium">Application Submitted</h4>
                                    <p className="text-sm text-gray-600">
                                        Your seller application has been successfully submitted.
                                    </p>
                                    <Badge variant="default" className="mt-1">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Complete
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs font-medium text-yellow-600">2</span>
                                </div>
                                <div>
                                    <h4 className="font-medium">Admin Review</h4>
                                    <p className="text-sm text-gray-600">
                                        Our admin team is reviewing your application and profile information.
                                    </p>
                                    <Badge variant="secondary" className="mt-1">
                                        <Clock className="h-3 w-3 mr-1" />
                                        In Progress
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs font-medium text-gray-600">3</span>
                                </div>
                                <div>
                                    <h4 className="font-medium">Account Activation</h4>
                                    <p className="text-sm text-gray-600">
                                        Once approved, you'll be able to list cars and access all seller features.
                                    </p>
                                    <Badge variant="outline" className="mt-1">
                                        Pending
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Your Account Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <User className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="font-medium">{user.name}</p>
                                        <p className="text-sm text-gray-600">Full Name</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="font-medium">{user.email}</p>
                                        <p className="text-sm text-gray-600">Email Address</p>
                                    </div>
                                </div>
                                
                                {user.phone && (
                                    <div className="flex items-center space-x-3">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="font-medium">{user.phone}</p>
                                            <p className="text-sm text-gray-600">Phone Number</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <p className="font-medium">Account Status</p>
                                    <Badge variant="secondary" className="mt-1">
                                        Pending Approval
                                    </Badge>
                                </div>
                                
                                <div>
                                    <p className="font-medium">Account Type</p>
                                    <Badge variant="default" className="mt-1">
                                        {user.role === 'admin' ? 'Administrator' : 'Seller'}
                                    </Badge>
                                </div>
                                
                                <div>
                                    <p className="font-medium">Registration Date</p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>While You Wait</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-medium mb-2">Complete Your Profile</h4>
                                <p className="text-sm text-gray-600 mb-3">
                                    Make sure your profile is complete to speed up the approval process.
                                </p>
                                <Link href={route('seller.profile.edit')}>
                                    <Button variant="outline">Update Profile</Button>
                                </Link>
                            </div>
                            
                            <div>
                                <h4 className="font-medium mb-2">Review Guidelines</h4>
                                <p className="text-sm text-gray-600 mb-3">
                                    Familiarize yourself with our seller guidelines and policies.
                                </p>
                                <Button variant="outline" disabled>
                                    View Guidelines
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="text-center">
                    <p className="text-sm text-gray-500">
                        Need help? Contact our support team at{' '}
                        <a href="mailto:support@carpoint.com" className="text-blue-600 hover:underline">
                            support@carpoint.com
                        </a>
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
