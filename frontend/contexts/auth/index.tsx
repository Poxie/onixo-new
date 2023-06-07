import { User } from '@/types';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';

export type AuthState = {
    setToken: (token: string | null) => void;
    token: string | null;
    loading: boolean;
    user: User | null;
    get: <T>(query: string, endpoint?: 'discord' | 'backend') => Promise<T>;
    patch: <T>(query: string, body?: Object) => Promise<T>;
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
        .then(async res => {
            if(!res.ok) throw new Error((await res.json()).message);
            return res.json();
        })
        .then((data: T) => data)
    }, [token]);

    const patch = useCallback(async function<T>(query: string, body?: Object, endpoint: 'discord' | 'backend'='discord') {
        // If body is provided, create a form data
        const formData = new FormData();
        Object.entries(body || {}).forEach(([key, value]) => {
            if(Array.isArray(value)) {
                if(value[0] instanceof File) {
                    value.forEach(v => formData.append(key, v));
                } else {
                    formData.append(key, JSON.stringify(value));
                }
                return;
            }
            formData.append(key, value);
        })

        return fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}${query}`, {
            method: 'PATCH',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(async res => {
            if(!res.ok) throw new Error((await res.json()).message);
            return res.json();
        })
        .then((data: T) => data)
    }, [token]);

    const post = useCallback(async function<T>(query: string, body?: Object, endpoint: 'discord' | 'backend'='discord') {
        // If body is provided, create a form data
        const formData = new FormData();
        Object.entries(body || {}).forEach(([key, value]) => {
            if(Array.isArray(value)) {
                if(value[0] instanceof File) {
                    value.forEach(v => formData.append(key, v));
                } else {
                    formData.append(key, JSON.stringify(value));
                }
                return;
            }
            formData.append(key, value);
        })

        return fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}${query}`, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(async res => {
            if(!res.ok) throw new Error((await res.json()).message);
            return res.json();
        })
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
            .catch(error => {
                const refreshToken = localStorage.getItem('refresh_token');
                if(!refreshToken) {
                    setLoading(false);
                    setToken(null);
                    setUser(null);
                    return;
                }

                post('/refresh', { refresh_token: refreshToken }, 'backend')
                    .then(data => {
                        
                    })
                    .catch(() => {
                        setLoading(false);
                        setToken(null);
                        setUser(null);
                    })
            })
    }, [token]);
    
    const value = {
        setToken,
        token,
        user,
        loading,
        get,
        patch
    }
    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}