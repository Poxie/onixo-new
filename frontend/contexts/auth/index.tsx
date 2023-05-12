import { Guild, User } from '@/types';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';

export type AuthState = {
    setToken: (token: string | null) => void;
    token: string | null;
    loading: boolean;
    user: User | null;
    guilds: Guild[] | null;
}

const AuthContext = React.createContext({} as AuthState);

export const useAuth = () => React.useContext(AuthContext);

export const AuthProvider: React.FC<{
    children: ReactElement | ReactElement[]
}> = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [guilds, setGuilds] = useState<Guild[] | null>(null);

    const get = useCallback((query: string) => {
        return fetch(`${process.env.NEXT_PUBLIC_DISCORD_API}${query}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }, [token]);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if(!token) return setLoading(false);

        setToken(token);
    }, []);

    useEffect(() => {
        if(user || !token) return;

        const reqs = [get('/users/@me'), get(`/users/@me/guilds`)];

        Promise.all(reqs)
            .then(async ([user, guilds]) => {
                const userData = await user.json();
                const guildData = await guilds.json();

                setUser(userData);
                setGuilds(guildData);

                setLoading(false);
            })
    }, [token]);
    
    const value = {
        setToken,
        token,
        user,
        guilds,
        loading
    }
    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}