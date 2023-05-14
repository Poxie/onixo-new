import styles from './Selection.module.scss';
import { GuildItem } from './GuildItem';
import { GuildItemSkeleton } from './GuildItemSkeleton';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { selectGuilds } from '@/redux/dashboard/selectors';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { Guild } from '@/types';
import { setGuilds } from '@/redux/dashboard/actions';

const PLACEHOLDER_COUNT = 8;
export const Selection = () => {
    const { get, token } = useAuth();

    const dispatch = useAppDispatch();
    const guilds = useAppSelector(selectGuilds);

    useEffect(() => {
        if(!token || guilds) return;

        get<Guild[]>('/guilds', 'backend')
            .then(guilds => {
                dispatch(setGuilds(guilds));
            })
    }, [get]);

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