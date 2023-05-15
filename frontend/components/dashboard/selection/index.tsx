import styles from './Selection.module.scss';
import { GuildItem } from './GuildItem';
import { GuildItemSkeleton } from './GuildItemSkeleton';
import { useAppSelector } from '@/redux/store';
import { selectGuilds } from '@/redux/dashboard/selectors';
import { NextPageWithLayout } from '@/pages/_app';
import { DashAuthLayout } from '@/layouts/dash-auth';

const PLACEHOLDER_COUNT = 8;
export const Selection: NextPageWithLayout = () => {
    const guilds = useAppSelector(selectGuilds);

    return(
        <main className={styles['container']}>
            <h1>
                Select your server
            </h1>
            <ul className={styles['guild-list']}>
                {guilds ? (
                    guilds.map(guild => (
                        <GuildItem 
                            {...guild}
                            key={guild.id}
                        />
                    ))
                ) : (
                    Array.from(Array(PLACEHOLDER_COUNT)).map((_,key) => (
                        <GuildItemSkeleton key={key} />
                    ))
                )}
            </ul>
        </main>
    )
}

Selection.getLayout = page => (
    <DashAuthLayout>
        {page}
    </DashAuthLayout>
)