import styles from './DashboardLayout.module.scss';
import { ReactElement, useEffect, useState } from "react"
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useGuildId } from '@/hooks/useGuildId';
import { useAuth } from '@/contexts/auth';
import { Channel, Role } from '@/types';
import { setGuildChannels, setGuildRoles } from '@/redux/dashboard/actions';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { selectChannelsFetched } from '@/redux/dashboard/selectors';
import Head from 'next/head';
import { request } from 'http';

export const DashboardLayout: React.FC<{
    children: ReactElement | ReactElement[];
}> = ({ children }) => {
    const guildId = useGuildId();
    const { get, token } = useAuth();
    
    const dispatch = useAppDispatch();
    const fetched = useAppSelector(state => selectChannelsFetched(state, guildId));

    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    // Fetching guild roles/channels on mount
    useEffect(() => {
        if(!token || !guildId || fetched) return;

        const requests = [
            get<Channel[]>(`/guilds/${guildId}/channels`, 'backend'),
            get<Role[]>(`/guilds/${guildId}/roles`, 'backend')
        ];

        Promise.all(requests)
            .then(([channels, roles]) => {
                dispatch(setGuildChannels(guildId, channels as Channel[]));
                dispatch(setGuildRoles(guildId, (roles as Role[]).filter(role => role.name !== '@everyone')));
            })
    }, [get, guildId, fetched]);
    
    return(
        <>
        <Head>
            <title>Onixo - Dashboard</title>
            <meta name="og:title" content="Onixo - Dashboard" />
            <meta name="viewport" content="width=device-width, maximum-scale=1"></meta>
        </Head>

        <div className={styles['dashboard']}>
            <Navbar 
                setOpen={setMobileSidebarOpen}
            />
            <div className={styles['main']}>
                <Sidebar 
                    open={mobileSidebarOpen}
                    setOpen={setMobileSidebarOpen}
                />
                <main className={styles['dash-content']}>
                    {children}
                </main>
            </div>
        </div>
        </>
    )
}