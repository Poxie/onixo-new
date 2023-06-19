import styles from './Home.module.scss';
import Head from "next/head"
import { Header } from "./Header"
import { QuickActions } from './QuickActions';
import { Tiles } from './Tiles';
import { Customize } from './Customize';

export const Home = () => {
    return(
        <>
        <Head>
            <link rel="icon" href="/favicon.ico" />
            <title>Onixo - Discord bot</title>
            <meta name="og:title" content="Onixo - Discord bot" />
            <meta name="description" content="Onixo is a Discord bot based around utility, moderation, fun and most of all: ease of use and customization." />
            <meta name="og:description" content="Onixo is a Discord bot based around utility, moderation, fun and most of all: ease of use and customization." />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name='og:image' content="/banner.png" />
            <meta name='image' content="/banner.png" />
        </Head>

        <main className={styles['main']}>
            <Header />
            <QuickActions />
            <Tiles />
            <Customize />
        </main>
        </>
    )
}