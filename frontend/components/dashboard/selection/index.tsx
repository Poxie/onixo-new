import Image from 'next/image';
import styles from './Selection.module.scss';
import { useAuth } from "@/contexts/auth"
import { getGuildIcon } from '@/utils/getImages';
import Button from '@/components/button';

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
                    <li className={styles['guild-item']}>
                        <div className={styles['guild-item-banner']}>
                            {guild.icon && (
                                <Image 
                                    src={getGuildIcon(guild.id, guild.icon)}
                                    alt=""
                                    fill
                                />
                            )}
                        </div>
                        <div className={styles['guild-item-text']}>
                            <div className={styles['guild-item-icon']}>
                                {guild.icon ? (
                                    <Image 
                                        width={60}
                                        height={60}
                                        src={getGuildIcon(guild.id, guild.icon)}
                                        className={styles['guild-item-icon']}
                                        alt=""
                                    />
                                ) : (
                                    <span>
                                        {guild.name[0].toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <span>
                                {guild.name}
                            </span>
                            {guild.invited ? (
                                <Button 
                                    type={'tertiary'}
                                    href={`/dashboard/${guild.id}`}
                                >
                                    Go to Dashboard
                                </Button>
                            ) : (
                                <Button>
                                    Invite to Server
                                </Button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </main>
    )
}