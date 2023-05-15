import styles from './DashboardLayout.module.scss';
import { ReactElement, useEffect } from "react"
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useGuildId } from '@/hooks/useGuildId';
import { useAuth } from '@/contexts/auth';
import { Channel } from '@/types';
import { setGuildChannels } from '@/redux/dashboard/actions';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { selectChannelsFetched } from '@/redux/dashboard/selectors';

export const DashboardLayout: React.FC<{
    children: ReactElement | ReactElement[];
}> = ({ children }) => {
    const guildId = useGuildId();
    const { get, token } = useAuth();
    
    const dispatch = useAppDispatch();
    const fetched = useAppSelector(state => selectChannelsFetched(state, guildId))

    // Fetching guild roles/channels on mount
    useEffect(() => {
        if(!token || !guildId || fetched) return;

        get<Channel[]>(`/guilds/${guildId}/channels`, 'backend')
            .then(channels => {
                dispatch(setGuildChannels(guildId, channels));
            })
    }, [get, guildId, fetched]);
    
    return(
        <div className={styles['dashboard']}>
            <Navbar />
            <div className={styles['main']}>
                <Sidebar />
                <main className={styles['dash-content']}>
                    {children}
                </main>
            </div>
        </div>
    )
}