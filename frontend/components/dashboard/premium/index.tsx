import styles from './Premium.module.scss';
import { PremiumPlans } from "@/components/premium/PremiumPlans"
import { DashAuthLayout } from "@/layouts/dash-auth"
import { DashboardLayout } from "@/layouts/dashboard"
import { NextPageWithLayout } from "@/pages/_app"
import { ModuleHeader } from "../module-header"
import Head from 'next/head';

export const Premium: NextPageWithLayout = () => {
    return(
        <>
        <Head>
            <script src="https://js.chargebee.com/v2/chargebee.js" data-cb-site={process.env.NEXT_PUBLIC_CHARGEBEE_SITE} defer></script>
        </Head>
        <ModuleHeader 
            header={'Premium'}
            subHeader={'Boose your server with Onixo premium. '}
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