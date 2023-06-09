import Image from 'next/image';
import styles from './Selection.module.scss';
import { getGuildIcon } from '@/utils/getImages';
import Button from '@/components/button';
import { useAppSelector } from '@/redux/store';
import { selectGuildById } from '@/redux/dashboard/selectors';
import { getInviteLink } from '@/utils/getLinks';

export const GuildItem: React.FC<{
    guildId: string;
}> = ({ guildId }) => {
    const guild = useAppSelector(state => selectGuildById(state, guildId));
    if(!guild) return null;

    const { id, name, icon, invited } = guild;
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
                    <Button href={getInviteLink(id)}>
                        Invite to Server
                    </Button>
                )}
            </div>
        </li>
    )
}