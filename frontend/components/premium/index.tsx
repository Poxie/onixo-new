import Link from 'next/link';
import styles from './Premium.module.scss';
import { PremiumTile } from "@/assets/tiles/PremiumTile"
import Button from '../button';
import Head from 'next/head';

export const Premium = () => {
    return(
        <>
        <Head>
            <title>Onixo - Premium</title>
            <meta name="og:title" content="Onixo - Premium" />
            <meta name="description" content="We are currently working on delivering Onixo Premium. It will introduce many new features as well as improvements on current features." />
            <meta name="og:description" content="We are currently working on delivering Onixo Premium. It will introduce many new features as well as improvements on current features." />
        </Head>

        <div className={styles['container']}>
            <div className={styles['text']}>
                <h1>
                    Onixo Premium is coming soon.
                </h1>
                <p>
                    We are currently working on delivering Onixo Premium.
                    It will introduce many new features as well as improvements on current features. Stay updated by joining our
                    {' '}
                    <Link href={'/support'}>
                        support server
                    </Link>
                    !
                </p>
                <div className={styles['buttons']}>
                    <Button href={'/support'}>
                        Support Server
                    </Button>
                </div>
            </div>
            
            <div className={styles['preview']} aria-hidden="true">
                <PremiumTile />
            </div>
        </div>
        </>
    )
}