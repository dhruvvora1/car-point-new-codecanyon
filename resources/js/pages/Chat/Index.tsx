import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
    MessageSquare, 
    Users, 
    Plus, 
    Clock,
    User
} from 'lucide-react';

interface ChatRoom {
    id: number;
    name: string;
    type: string;
    description?: string;
    participants: Array<{
        id: number;
        name: string;
        avatar?: string;
    }>;
    latest_message?: {
        id: number;
        message: string;
        sender: {
            id: number;
            name: string;
        };
        created_at: string;
    };
    updated_at: string;
}

interface ChatIndexProps {
    chatRooms: ChatRoom[];
}

export default function ChatIndex({ chatRooms }: ChatIndexProps) {
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffInHours < 168) { // 7 days
            return date.toLocaleDateString([], { weekday: 'short' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };

    const groupChats = chatRooms.filter(room => room.type === 'group');
    const privateChats = chatRooms.filter(room => room.type === 'private');

    return (
        <AppLayout>
            <Head title="Chat" />
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Chat</h1>
                        <p className="text-gray-600">Connect with other sellers and admin</p>
                    </div>
                    <Link href={route('chat.group')}>
                        <Button>
                            <Users className="h-4 w-4 mr-2" />
                            Join Group Chat
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Group Chats */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Users className="h-5 w-5 mr-2" />
                                Group Chats
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {groupChats.map((room) => (
                                    <Link key={room.id} href={route('chat.show', room.id)}>
                                        <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                            <div className="flex -space-x-2">
                                                {room.participants.slice(0, 3).map((participant) => (
                                                    <Avatar key={participant.id} className="h-8 w-8 border-2 border-white">
                                                        <AvatarImage src={participant.avatar} />
                                                        <AvatarFallback className="text-xs">
                                                            {getInitials(participant.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                ))}
                                                {room.participants.length > 3 && (
                                                    <div className="h-8 w-8 bg-gray-200 border-2 border-white rounded-full flex items-center justify-center">
                                                        <span className="text-xs font-medium">
                                                            +{room.participants.length - 3}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-medium">{room.name}</h4>
                                                    <Badge variant="outline">
                                                        {room.participants.length} members
                                                    </Badge>
                                                </div>
                                                {room.latest_message && (
                                                    <p className="text-sm text-gray-600 truncate">
                                                        {room.latest_message.sender.name}: {room.latest_message.message}
                                                    </p>
                                                )}
                                                {room.description && (
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {room.description}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                {room.latest_message && (
                                                    <p className="text-xs text-gray-500">
                                                        {formatTime(room.latest_message.created_at)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                                
                                {groupChats.length === 0 && (
                                    <div className="text-center py-8">
                                        <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                        <p className="text-gray-500">No group chats available</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Private Chats */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <User className="h-5 w-5 mr-2" />
                                Private Chats
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {privateChats.map((room) => {
                                    const otherParticipant = room.participants.find(p => p.id !== auth().user.id);
                                    
                                    return (
                                        <Link key={room.id} href={route('chat.show', room.id)}>
                                            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={otherParticipant?.avatar} />
                                                    <AvatarFallback>
                                                        {otherParticipant ? getInitials(otherParticipant.name) : '?'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <h4 className="font-medium">
                                                        {otherParticipant?.name || 'Unknown User'}
                                                    </h4>
                                                    {room.latest_message && (
                                                        <p className="text-sm text-gray-600 truncate">
                                                            {room.latest_message.message}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    {room.latest_message && (
                                                        <p className="text-xs text-gray-500">
                                                            {formatTime(room.latest_message.created_at)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                                
                                {privateChats.length === 0 && (
                                    <div className="text-center py-8">
                                        <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                        <p className="text-gray-500">No private chats yet</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Start a conversation with admin or other sellers
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="text-center">
                        <CardContent className="p-6">
                            <Users className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                            <h3 className="font-semibold mb-2">Group Chat</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Join the general sellers discussion
                            </p>
                            <Link href={route('chat.group')}>
                                <Button className="w-full">Join Group Chat</Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="text-center">
                        <CardContent className="p-6">
                            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-green-500" />
                            <h3 className="font-semibold mb-2">Contact Admin</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Get help from the admin team
                            </p>
                            <Button className="w-full" disabled>
                                Coming Soon
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="text-center">
                        <CardContent className="p-6">
                            <Clock className="h-12 w-12 mx-auto mb-4 text-purple-500" />
                            <h3 className="font-semibold mb-2">Recent Activity</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                View your recent chat history
                            </p>
                            <Button variant="outline" className="w-full">
                                View History
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
