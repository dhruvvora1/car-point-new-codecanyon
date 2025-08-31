import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseWebSocketProps {
    url?: string;
    options?: any;
}

export function useWebSocket({ url, options = {} }: UseWebSocketProps = {}) {
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState<any>(null);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const socketUrl = url || `${window.location.protocol}//${window.location.hostname}:6001`;
        
        socketRef.current = io(socketUrl, {
            transports: ['websocket'],
            ...options,
        });

        const socket = socketRef.current;

        socket.on('connect', () => {
            setIsConnected(true);
            console.log('WebSocket connected');
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
            console.log('WebSocket disconnected');
        });

        socket.on('message', (data: any) => {
            setLastMessage(data);
        });

        return () => {
            socket.disconnect();
        };
    }, [url]);

    const sendMessage = (event: string, data: any) => {
        if (socketRef.current && isConnected) {
            socketRef.current.emit(event, data);
        }
    };

    const joinRoom = (roomId: string | number) => {
        if (socketRef.current && isConnected) {
            socketRef.current.emit('join-room', roomId);
        }
    };

    const leaveRoom = (roomId: string | number) => {
        if (socketRef.current && isConnected) {
            socketRef.current.emit('leave-room', roomId);
        }
    };

    const subscribe = (event: string, callback: (data: any) => void) => {
        if (socketRef.current) {
            socketRef.current.on(event, callback);
        }
    };

    const unsubscribe = (event: string, callback?: (data: any) => void) => {
        if (socketRef.current) {
            if (callback) {
                socketRef.current.off(event, callback);
            } else {
                socketRef.current.off(event);
            }
        }
    };

    return {
        isConnected,
        lastMessage,
        sendMessage,
        joinRoom,
        leaveRoom,
        subscribe,
        unsubscribe,
        socket: socketRef.current,
    };
}
