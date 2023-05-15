import styles from './Moderation.module.scss';
import { DashAuthLayout } from "@/layouts/dash-auth"
import { DashboardLayout } from "@/layouts/dashboard"
import { NextPageWithLayout } from "@/pages/_app"
import { ModuleHeader } from "../module-header"
import { Chips } from "@/components/chips"
import { ModuleSection } from '../module-section';
import { ModuleSubsection } from '../module-subsection';
import { LinkPresets } from './LinkPresets';
import { Input } from '@/components/input';
import { CustomLinks } from './CustomLinks';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { useRouter } from 'next/router';
import { useGuildId } from '@/hooks/useGuildId';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { selectAutomodFetched } from '@/redux/dashboard/selectors';
import { addAutomod } from '@/redux/dashboard/actions';
import { AutoMod } from '@/types';

const CHIPS = [
    { text: 'Automod', id: 'automod' },
    { text: 'Logging', id: 'logging' },
    { text: 'Commands', id: 'commands' },
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

    return(
        <>
            <ModuleHeader 
                header="Moderation"
                subHeader="Keep your server clean with our large range of moderation tools."
            />
            <Chips 
                chips={CHIPS}
                className={styles['chips']}
            />
            <ModuleSection
                header={'Anti-link'}
                description={'Prevent unwanted links from appearing in your server.'}
                className={styles['section']}
            >
                <ModuleSubsection
                    header={'Preset links'}
                >
                    <LinkPresets />
                </ModuleSubsection>
                <ModuleSubsection
                    header={'Custom links'}
                    subHeader='Add your own custom links to scan for. We will automatically scan for all possible link combinations.'
                >
                    <CustomLinks />
                </ModuleSubsection>
            </ModuleSection>
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