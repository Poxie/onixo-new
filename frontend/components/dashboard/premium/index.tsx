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

export const Premium: NextPageWithLayout = () => {
    const guildId = useGuildId();
    const { setModal } = useModal();
    const { id: hostedPageId } = useRouter().query as { id?: string };

    useEffect(() => {
        if(!hostedPageId || !guildId) return;

        setModal(
            <SubscriptionModal 
                guildId={guildId}
                hostedPageId={hostedPageId}
            />
        );
    }, [hostedPageId, guildId]);

    // Making sure to register chargebee again due to react rendering
    useEffect(() => {
        (window as any).Chargebee?.registerAgain();
    }, []);

    return(
        <>
        <Head>
            <script src="https://js.chargebee.com/v2/chargebee.js" data-cb-site={process.env.NEXT_PUBLIC_CHARGEBEE_SITE} defer></script>
        </Head>
        <ModuleHeader 
            header={'Premium'}
            subHeader={'Boost your server with Onixo premium. '}
        />
        <div className={styles['plans']}>
            <PremiumPlans />
        </div>
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