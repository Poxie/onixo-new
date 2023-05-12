import Image from 'next/image';
import styles from './Dashboard.module.scss';
import { useAuth } from "@/contexts/auth"
import { getGuildIcon } from '@/utils/getImages';
import Button from '../button';

export const Dashboard = () => {
    const { guilds } = useAuth();
    if(!guilds) return;

    return(
        <main className={styles['container']}>
            <h1>
                Select your server
            </h1>
            <ul className={styles['guild-list']}>
                {guilds.map(guild => (
                    <li className={styles['guild-item']}>
                        <div className={styles['guild-item-banner']}>
                            <Image 
                                src={getGuildIcon(guild.id, guild.icon)}
                                alt=""
                                fill
                            />
                        </div>
                        <div className={styles['guild-item-text']}>
                            <Image 
                                width={60}
                                height={60}
                                src={getGuildIcon(guild.id, guild.icon)}
                                className={styles['guild-item-icon']}
                                alt=""
                            />
                            <span>
                                {guild.name}
                            </span>
                            <Button>
                                Go to Dashboard
                            </Button>
                        </div>
                    </li>
                ))}
            </ul>
        </main>
    )
}