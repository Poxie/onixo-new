import Image from 'next/image';
import styles from './Selection.module.scss';
import { Guild } from "@/types";
import { getGuildIcon } from '@/utils/getImages';
import Button from '@/components/button';

export const GuildItem: React.FC<Guild> = ({ id, icon, name, invited }) => {
    return(
        <li className={styles['guild-item']}>
            <div className={styles['guild-item-banner']}>
                {icon && (
                    <Image 
                        src={getGuildIcon(id, icon)}
                        alt=""
                        fill
                    />
                )}
            </div>
            <div className={styles['guild-item-text']}>
                <div className={styles['guild-item-icon']}>
                    {icon ? (
                        <Image 
                            width={60}
                            height={60}
                            src={getGuildIcon(id, icon)}
                            className={styles['guild-item-icon']}
                            alt=""
                        />
                    ) : (
                        <span>
                            {name[0].toUpperCase()}
                        </span>
                    )}
                </div>
                <span>
                    {name}
                </span>
                {invited ? (
                    <Button 
                        type={'tertiary'}
                        href={`/dashboard/${id}`}
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
    )
}