import { User } from '@/types';
import React, { ReactElement, useEffect, useState } from 'react';

export type AuthState = {
    loading: boolean;
    token: string | null;
    user: User | null;
}

const AuthContext = React.createContext({} as AuthState);

export const useAuth = () => React.useContext(AuthContext);

export const AuthProvider: React.FC<{
    children: ReactElement | ReactElement[]
}> = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if(!token) return setLoading(false);

        setToken(token);
    }, []);

    useEffect(() => {
        if(user || !token) return;

        fetch(`${process.env.NEXT_PUBLIC_DISCORD_API}/users/@me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(user => {
            setUser(user);
            setLoading(false);
        })
    }, [token]);
    
    const value = {
        token,
        user,
        loading
    }
    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}