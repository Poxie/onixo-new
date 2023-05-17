import styles from './Moderation.module.scss';
import { DashAuthLayout } from "@/layouts/dash-auth"
import { DashboardLayout } from "@/layouts/dashboard"
import { NextPageWithLayout } from "@/pages/_app"
import { ModuleHeader } from "../module-header"
import { Chips } from "@/components/chips"
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { useGuildId } from '@/hooks/useGuildId';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { selectAutomodFetched } from '@/redux/dashboard/selectors';
import { addAutomod } from '@/redux/dashboard/actions';
import { AutoMod } from '@/types';
import { Automod } from './automod';
import { ActionLogs } from './action-logs';
import { ModSettings } from './settings';

const CHIPS = [
    { text: 'Automod', id: 'automod' },
    { text: 'Action logs', id: 'action-logs' },
    { text: 'Settings', id: 'settings' },
]
export const Moderation: NextPageWithLayout = () => {
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
                onChange={setActiveChip}
                defaultActive={activeChip}
                className={styles['chips']}
            />
            {activeChip === 'automod' && (
                <Automod />
            )}
            {activeChip === 'action-logs' && (
                <ActionLogs />
            )}
            {activeChip === 'settings' && (
                <ModSettings />
            )}
        </>
    )
}

Moderation.getLayout = page => (
    <DashAuthLayout>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </DashAuthLayout>
)