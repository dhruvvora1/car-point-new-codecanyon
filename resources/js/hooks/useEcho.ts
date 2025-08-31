import { useEffect, useState } from 'react';
import echo from '@/echo';

export function useEcho() {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Listen for connection events
        echo.connector.pusher.connection.bind('connected', () => {
            setIsConnected(true);
            console.log('Echo connected');
        });

        echo.connector.pusher.connection.bind('disconnected', () => {
            setIsConnected(false);
            console.log('Echo disconnected');
        });

        return () => {
            // Cleanup if needed
        };
    }, []);

    const joinPrivateChannel = (channelName: string) => {
        return echo.private(channelName);
    };

    const joinChannel = (channelName: string) => {
        return echo.channel(channelName);
    };

    const leaveChannel = (channelName: string) => {
        echo.leaveChannel(channelName);
    };

    const listenForMessage = (channelName: string, eventName: string, callback: (data: any) => void) => {
        const channel = joinPrivateChannel(channelName);
        if (channel) {
            channel.listen(eventName, callback);
        }
        return channel;
    };

    return {
        isConnected,
        echo,
        joinPrivateChannel,
        joinChannel,
        leaveChannel,
        listenForMessage,
    };
}
