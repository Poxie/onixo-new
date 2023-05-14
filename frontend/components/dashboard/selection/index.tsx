import Image from 'next/image';
import styles from './Selection.module.scss';
import { useAuth } from "@/contexts/auth"
import { getGuildIcon } from '@/utils/getImages';
import Button from '@/components/button';
import { GuildItem } from './GuildItem';

export const Selection = () => {
    const { guilds } = useAuth();
    if(!guilds) return null;

    return(
        <main className={styles['container']}>
            <h1>
                Select your server
            </h1>
            <ul className={styles['guild-list']}>
                {guilds.map(guild => (
                    <GuildItem 
                        {...guild}
                        key={guild.id}
                    />
                ))}
            </ul>
        </main>
    )
}