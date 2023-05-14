import { User } from '@/types';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';

export type AuthState = {
    setToken: (token: string | null) => void;
    token: string | null;
    loading: boolean;
    user: User | null;
    get: <T>(query: string, endpoint?: 'discord' | 'backend') => Promise<T>;
}

const AuthContext = React.createContext({} as AuthState);

export const useAuth = () => React.useContext(AuthContext);

export const AuthProvider: React.FC<{
    children: any;
}> = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    const get = useCallback(async function<T>(query: string, endpoint: 'discord' | 'backend'='discord') {
        return fetch(`${endpoint === 'discord' ? process.env.NEXT_PUBLIC_DISCORD_API : process.env.NEXT_PUBLIC_API_ENDPOINT}${query}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then((data: T) => data)
    }, [token]);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if(!token) return setLoading(false);

        setToken(token);
    }, []);

    useEffect(() => {
        if(user || !token) return;

        get<User>('/users/@me')
            .then(user => {
                setUser(user);
                setLoading(false);
            })
    }, [token]);
    
    const value = {
        setToken,
        token,
        user,
        loading,
        get
    }
    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}