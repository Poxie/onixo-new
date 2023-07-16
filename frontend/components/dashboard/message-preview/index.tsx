import styles from './MessagePreview.module.scss'
import { ModuleSubheader } from "../module-subheader"
import Image from 'next/image';
import { replaceVariables } from '@/utils/variables';
import { useAuth } from '@/contexts/auth';
import { useGuildId } from '@/hooks/useGuildId';
import { useAppSelector } from '@/redux/store';
import { Embed as EmbedType, Guild, User } from '@/types';
import { getCurrentTime } from '@/utils';
import { Embed } from '@/components/embed';
import { selectGuildById } from '@/redux/slices/dashboard';

export const MessagePreview: React.FC<{
    channelName: string;
    message?: string;
    embed?: EmbedType;
    placeholder?: string;
    loading?: boolean;
}> = ({ channelName, message, embed, placeholder, loading }) => {
    const guildId = useGuildId();
    const { user } = useAuth();

    const guild = useAppSelector(state => selectGuildById(state, guildId));

    return(
        <div>
            <ModuleSubheader>
                Preview
            </ModuleSubheader>
            <div className={styles['container']}>
                <span className={styles['channel']}>
                    {!loading ? channelName : (
                        <span className={styles['skeleton-text']} />
                    )}
                </span>
                <div className={styles['main']}>
                    <Image 
                        className={styles['avatar']}
                        src="/avatars/onixo.png"
                        width={38}
                        height={38}
                        alt=""
                    />

                    <div>
                        <span className={styles['name']}>
                            Onixo 
                            <span className={styles['bot-badge']}>bot</span> 
                            <span className={styles['timestamp']}>Today at {getCurrentTime()}</span>
                        </span>
                        <span className={styles['message']}>
                            {loading ? (
                                <span className={styles['skeleton-text']} />
                            ) : (
                                message ? replaceVariables(message, user as User, guild as Guild) : (
                                    <span className={styles['empty-message']}>
                                        {placeholder}
                                    </span>
                                )
                            )}
                            {!loading && embed && (
                                <Embed {...embed} />
                            )}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}