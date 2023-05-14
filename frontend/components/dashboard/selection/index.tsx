import styles from './Selection.module.scss';
import { useAuth } from "@/contexts/auth"
import { GuildItem } from './GuildItem';
import { GuildItemSkeleton } from './GuildItemSkeleton';

const PLACEHOLDER_COUNT = 8;
export const Selection = () => {
    const { guilds } = useAuth();

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