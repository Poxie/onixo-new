import styles from './Premium.module.scss';
import Head from 'next/head';
import { PremiumPlans } from './PremiumPlans';
import React, { useCallback, useEffect, useState } from 'react';

const PremiumContext = React.createContext({} as {
    openCheckout: () => void;
});

export const usePremium = () => React.useContext(PremiumContext);

export const Premium = () => {
    useEffect(() => {
        const script = document.createElement('script');

        script.onload = () => {
            (window as any).Chargebee.init({
                site: 'onixo-test'
            });
            (window as any).Chargebee.registerAgain();
        };

        script.setAttribute('src', 'https://js.chargebee.com/v2/chargebee.js');
        document.body.append(script)
    }, []);

    return(
        <>
        <Head>
            <title>Onixo - Premium</title>
            <meta name="og:title" content="Onixo - Premium" />
            <meta name="description" content="We are currently working on delivering Onixo Premium. It will introduce many new features as well as improvements on current features." />
            <meta name="og:description" content="We are currently working on delivering Onixo Premium. It will introduce many new features as well as improvements on current features." />
            <script src="https://js.chargebee.com/v2/chargebee.js" data-cb-site={process.env.NEXT_PUBLIC_CHARGEBEE_SITE}></script>
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