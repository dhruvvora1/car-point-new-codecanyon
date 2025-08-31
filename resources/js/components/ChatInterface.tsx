import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Send, Image, Car, MoreVertical } from 'lucide-react';
import { useForm } from '@inertiajs/react';

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

interface ChatInterfaceProps {
    chatRoom: ChatRoom;
    messages: Message[];
    currentUser: any;
}

export default function ChatInterface({ chatRoom, messages, currentUser }: ChatInterfaceProps) {
    const [newMessage, setNewMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { post, processing } = useForm();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newMessage.trim() && !selectedImage) return;

        const formData = new FormData();
        formData.append('message', newMessage);
        formData.append('type', selectedImage ? 'image' : 'text');
        
        if (selectedImage) {
            formData.append('attachment', selectedImage);
        }

        post(route('chat.send', chatRoom.id), {
            data: formData,
            onSuccess: () => {
                setNewMessage('');
                setSelectedImage(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                        {chatRoom.name}
                        <Badge variant="outline" className="ml-2">
                            {chatRoom.type === 'group' ? 'Group' : 'Private'}
                        </Badge>
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                        {chatRoom.participants.slice(0, 3).map((participant) => (
                            <Avatar key={participant.id} className="h-8 w-8">
                                <AvatarImage src={participant.avatar} />
                                <AvatarFallback className="text-xs">
                                    {getInitials(participant.name)}
                                </AvatarFallback>
                            </Avatar>
                        ))}
                        {chatRoom.participants.length > 3 && (
                            <Badge variant="secondary">
                                +{chatRoom.participants.length - 3}
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.sender.id === currentUser.id ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex max-w-xs lg:max-w-md ${message.sender.id === currentUser.id ? 'flex-row-reverse' : 'flex-row'}`}>
                            <Avatar className="h-8 w-8 mx-2">
                                <AvatarImage src={message.sender.avatar} />
                                <AvatarFallback className="text-xs">
                                    {getInitials(message.sender.name)}
                                </AvatarFallback>
                            </Avatar>
                            
                            <div className={`rounded-lg p-3 ${
                                message.sender.id === currentUser.id 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-100 text-gray-900'
                            }`}>
                                {message.sender.id !== currentUser.id && (
                                    <p className="text-xs font-medium mb-1 opacity-70">
                                        {message.sender.name}
                                    </p>
                                )}
                                
                                {message.type === 'image' && message.attachment_url && (
                                    <img
                                        src={message.attachment_url}
                                        alt="Attachment"
                                        className="rounded mb-2 max-w-full h-auto"
                                    />
                                )}
                                
                                {message.type === 'car_reference' && message.car && (
                                    <div className="bg-white/10 rounded p-2 mb-2">
                                        <div className="flex items-center">
                                            <Car className="h-4 w-4 mr-2" />
                                            <div>
                                                <p className="font-medium text-sm">
                                                    {message.car.brand} {message.car.model} ({message.car.year})
                                                </p>
                                                <p className="text-xs opacity-70">
                                                    {message.car.currency} {message.car.price.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                <p className="text-sm">{message.message}</p>
                                <p className="text-xs opacity-70 mt-1">
                                    {formatTime(message.created_at)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </CardContent>

            <div className="border-t p-4">
                {selectedImage && (
                    <div className="mb-3 p-2 bg-gray-50 rounded flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                            Image selected: {selectedImage.name}
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setSelectedImage(null);
                                if (fileInputRef.current) {
                                    fileInputRef.current.value = '';
                                }
                            }}
                        >
                            Remove
                        </Button>
                    </div>
                )}
                
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                    />
                    
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Image className="h-4 w-4" />
                    </Button>
                    
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1"
                        disabled={processing}
                    />
                    
                    <Button type="submit" disabled={processing || (!newMessage.trim() && !selectedImage)}>
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </Card>
    );
}
