import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import ChatInterface from '@/components/ChatInterface';

interface Message {
    id: number;
    message: string;
    type: string;
    attachment_url?: string;
    car_id?: number;
    sender: {
        id: number;
        name: string;
        avatar?: string;
    };
    car?: {
        id: number;
        brand: string;
        model: string;
        year: number;
        price: number;
        currency: string;
    };
    created_at: string;
}

interface ChatRoom {
    id: number;
    name: string;
    type: string;
    participants: Array<{
        id: number;
        name: string;
        avatar?: string;
    }>;
}

interface ChatShowProps {
    chatRoom: ChatRoom;
    messages: Message[];
    auth: {
        user: any;
    };
}

export default function ChatShow({ chatRoom, messages, auth }: ChatShowProps) {
    return (
        <AppLayout>
            <Head title={`Chat - ${chatRoom.name}`} />
            
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Chat</h1>
                    <p className="text-gray-600">{chatRoom.name}</p>
                </div>

                <ChatInterface
                    chatRoom={chatRoom}
                    messages={messages}
                    currentUser={auth.user}
                />
            </div>
        </AppLayout>
    );
}
