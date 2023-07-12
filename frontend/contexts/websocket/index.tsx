import React, { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuth } from '../auth';

const WebsocketContext = React.createContext({} as {
    socket: Socket | null;
})

export const useWebsocket = () => React.useContext(WebsocketContext);

export const WebsocketProvider: React.FC<{
    children: any;
}> = ({ children }) => {
    const { token } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if(!token) return;
        
        const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_ORIGIN, {
            auth: { token }
        });
        
        socket.on('connect', () => {
            console.log(socket.id);
        })

        setSocket(socket);

        return () => {
            socket.disconnect();
        }
    }, [token]);

    const value = {
        socket
    }
    return(
        <WebsocketContext.Provider value={value}>
            {children}
        </WebsocketContext.Provider>
    )
}