import styles from './Selection.module.scss';
import { GuildItem } from './GuildItem';
import { GuildItemSkeleton } from './GuildItemSkeleton';
import { useAppSelector } from '@/redux/store';
import { selectGuildIds } from '@/redux/dashboard/selectors';
import { NextPageWithLayout } from '@/pages/_app';
import { DashAuthLayout } from '@/layouts/dash-auth';
import Head from 'next/head';
import { useAuth } from '@/contexts/auth';
import { getLoginLink } from '@/utils/getLinks';

const PLACEHOLDER_COUNT = 8;
export const Selection: NextPageWithLayout = () => {
    const { token, loading } = useAuth();

    const guildIds = useAppSelector(selectGuildIds);

    // If user is not logged in
    if(!loading && !token) {
        window.location.href = getLoginLink();
        return null;
    }

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