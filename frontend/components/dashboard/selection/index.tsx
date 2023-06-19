import styles from './Selection.module.scss';
import { GuildItem } from './GuildItem';
import { GuildItemSkeleton } from './GuildItemSkeleton';
import { useAppSelector } from '@/redux/store';
import { selectGuildIds } from '@/redux/dashboard/selectors';
import { NextPageWithLayout } from '@/pages/_app';
import { DashAuthLayout } from '@/layouts/dash-auth';
import Head from 'next/head';

const PLACEHOLDER_COUNT = 8;
export const Selection: NextPageWithLayout = () => {
    const guildIds = useAppSelector(selectGuildIds);

    return(
        <>
        <Head>
            <title>Onixo - Select Server</title>
            <meta name="og:title" content="Onixo - Select Server" />
            <meta name="description" content="Select your server and you will be directed to the dashboard." />
            <meta name="og:description" content="Select your server and you will be directed to the dashboard." />
        </Head>

        <main className={styles['container']}>
            <h1>
                Select your server
            </h1>
            <ul className={styles['guild-list']}>
                {guildIds ? (
                    guildIds.map(guildId => (
                        <GuildItem 
                            guildId={guildId}
                            key={guildId}
                        />
                    ))
                ) : (
                    Array.from(Array(PLACEHOLDER_COUNT)).map((_,key) => (
                        <GuildItemSkeleton key={key} />
                    ))
                )}
            </ul>
            {guildIds && !guildIds.length && (
                <span>
                    You are not admin on any servers. If this is incorrect, try refreshing the page or reaching out on our support server.
                </span>
            )}
        </main>
        </>
    )
}

Selection.getLayout = page => (
    <DashAuthLayout>
        {page}
    </DashAuthLayout>
)