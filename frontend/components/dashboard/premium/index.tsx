import styles from './Premium.module.scss';
import { PremiumPlans } from "@/components/premium/PremiumPlans"
import { DashAuthLayout } from "@/layouts/dash-auth"
import { DashboardLayout } from "@/layouts/dashboard"
import { NextPageWithLayout } from "@/pages/_app"
import { ModuleHeader } from "../module-header"
import Head from 'next/head';
import { useEffect } from 'react';
import { useModal } from '@/contexts/modal';
import { useRouter } from 'next/router';
import { SubscriptionModal } from '@/modals/subscription';
import { useGuildId } from '@/hooks/useGuildId';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { GuildIcon } from '@/components/guild-icon';
import { CancelSubscriptionModal } from '@/modals/cancel-subscription';
import { getRelativeTime } from '@/utils';
import { selectGuildById, updateGuild } from '@/redux/slices/dashboard';

export const Premium: NextPageWithLayout = () => {
    const guildId = useGuildId();
    const { setModal } = useModal();
    const { id: hostedPageId } = useRouter().query as { id?: string };

    const dispatch = useAppDispatch();
    const guild = useAppSelector(state => selectGuildById(state, guildId));

    useEffect(() => {
        if(!hostedPageId || !guildId) return;

        const onSubscriptionConfimed = () => {
            dispatch(updateGuild({ guildId, property: 'premium', value: true }));
        }

        setModal(
            <SubscriptionModal 
                guildId={guildId}
                hostedPageId={hostedPageId}
                onSubscriptionConfimed={onSubscriptionConfimed}
            />
        );
    }, [hostedPageId, guildId]);

    // Making sure to register chargebee again due to react rendering
    useEffect(() => {
        (window as any).Chargebee?.init({
            site: process.env.NEXT_PUBLIC_CHARGEBEE_SITE,
            domain: process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_FRONTEND_ORIGIN : undefined,
            iframeOnly: true
        })
    }, []);

    const cancelSubscription = () => setModal(<CancelSubscriptionModal />);

    return(
        <>
        <Head>
            <script src="https://js.chargebee.com/v2/chargebee.js"></script>
        </Head>
        {!guild?.premium && (
            <>
            <ModuleHeader 
                header={'Premium'}
                subHeader={'Boost your server with Onixo premium. '}
            />
            <div className={styles['plans']}>
                <PremiumPlans />
            </div>
            </>
        )}
        {guild?.premium && (
            <div className={styles['active']}>
                <div className={styles['active-main']}>
                    <GuildIcon 
                        guildId={guildId}
                        icon={guild.icon}
                        name={guild.name}
                        className={styles['icon']}
                    />
                    <span>
                        {guild.name} has premium enabled.
                    </span>
                </div>
                {!guild.premium_ends_at && (
                    <button 
                        className={styles['cancel-button']}
                        onClick={cancelSubscription}
                    >
                        Cancel subscription
                    </button>
                )}
                {guild.premium_ends_at && (
                    <span className={styles['ends-at']}>
                        Ends on
                        {' '}
                        {getRelativeTime(guild.premium_ends_at).readableDate.split(' ')[0]}
                    </span>
                )}
            </div>
        )}
        </>
    )
}

Premium.getLayout = page => (
    <DashAuthLayout>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </DashAuthLayout>
)