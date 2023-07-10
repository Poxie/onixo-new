import styles from './Premium.module.scss';
import Head from 'next/head';
import { PremiumPlans } from './PremiumPlans';

export const Premium = () => {
    return(
        <>
        <Head>
            <title>Onixo - Premium</title>
            <meta name="og:title" content="Onixo - Premium" />
            <meta name="description" content="We are currently working on delivering Onixo Premium. It will introduce many new features as well as improvements on current features." />
            <meta name="og:description" content="We are currently working on delivering Onixo Premium. It will introduce many new features as well as improvements on current features." />
            <script src="https://js.chargebee.com/v2/chargebee.js" data-cb-site={process.env.NEXT_PUBLIC_CHARGEBEE_SITE} defer></script>
        </Head>

        <div className={styles['container']}>
            <h1>
                Time to boost your server?
            </h1>
            <PremiumPlans />
        </div>
        </>
    )
}