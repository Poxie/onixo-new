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
            <title>Create Next App</title>
            <meta name="description" content="Generated by create next app" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
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