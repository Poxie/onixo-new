import styles from './MessagePreview.module.scss'
import { ModuleSubheader } from "../module-subheader"
import Image from 'next/image';
import { replaceVariables } from '@/utils/variables';
import { useAuth } from '@/contexts/auth';
import { useGuildId } from '@/hooks/useGuildId';
import { useAppSelector } from '@/redux/store';
import { selectGuildById } from '@/redux/dashboard/selectors';
import { Embed as EmbedType } from '@/types';
import { getCurrentTime } from '@/utils';
import { Embed } from '@/components/embed';

export const MessagePreview: React.FC<{
    channelName: string;
    message?: string;
    embed?: EmbedType;
    placeholder?: string;
}> = ({ channelName, message, embed, placeholder }) => {
    const guildId = useGuildId();
    const { user } = useAuth();

    const guild = useAppSelector(state => selectGuildById(state, guildId));

    if(!guild || !user) return null;
    return(
        <div>
            <ModuleSubheader>
                Preview
            </ModuleSubheader>
            <div className={styles['container']}>
                <span className={styles['channel']}>
                    {channelName}
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
                            {message ? replaceVariables(message, user, guild) : (
                                <span className={styles['empty-message']}>
                                    {placeholder}
                                </span>
                            )}
                            {embed && (
                                <Embed {...embed} />
                            )}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}