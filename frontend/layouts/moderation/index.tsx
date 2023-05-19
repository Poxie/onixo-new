import styles from './ModerationLayout.module.scss';
import { Chips } from "@/components/chips"
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { useGuildId } from '@/hooks/useGuildId';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { selectAutomodFetched } from '@/redux/dashboard/selectors';
import { addAutomod } from '@/redux/dashboard/actions';
import { AutoMod } from '@/types';
import { ModuleHeader } from '@/components/dashboard/module-header';

const CHIPS = [
    { text: 'Automod', id: 'automod' },
    { text: 'Action logs', id: 'action-logs' },
    { text: 'Settings', id: 'settings' },
]
export const ModerationLayout: React.FC<{
    children: any;
}> = ({ children }) => {
    const guildId = useGuildId();
    const { get, token } = useAuth();

    const dispatch = useAppDispatch();
    const hasFetched = useAppSelector(state => selectAutomodFetched(state, guildId));

    // If automod has not yet fetched, fetch it
    useEffect(() => {
        if(!token || !guildId || hasFetched) return;

        get<AutoMod>(`/guilds/${guildId}/automod`, 'backend')
            .then(automod => {
                dispatch(addAutomod(automod));
            });
    }, [get, guildId, hasFetched]);

    const [activeChip, setActiveChip] = useState('automod');

    return(
        <>
            <ModuleHeader 
                header="Moderation"
                subHeader="Keep your server clean with our large range of moderation tools."
            />
            <Chips 
                chips={CHIPS}
                basePath={`/dashboard/${guildId}/moderation`}
                onChange={setActiveChip}
                defaultActive={activeChip}
                className={styles['chips']}
            />
            {children}
        </>
    )
}