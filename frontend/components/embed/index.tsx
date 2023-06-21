import { replaceVariables } from '@/utils/variables';
import styles from './Embed.module.scss';
import { Embed as EmbedType } from '@/types';
import { useAuth } from '@/contexts/auth';
import { useGuildId } from '@/hooks/useGuildId';
import { useAppSelector } from '@/redux/store';
import { selectGuildById } from '@/redux/dashboard/selectors';

export const Embed: React.FC<EmbedType> = ({ fields, author, footer, url, title, description }) => {
    const { user } = useAuth();
    const guildId = useGuildId();
    const guild = useAppSelector(state => selectGuildById(state, guildId));

    if(!user || !guild) return null;

    const validFields = fields.filter(field => field.name || field.value);
    return(
        <div className={styles['container']}>
            {author.text && (
                <span className={styles['author']}>
                    {author.icon && (
                        <img 
                            src={replaceVariables(author.icon, user, guild)}
                            alt=""
                        />
                    )}
                    {replaceVariables(author.text, user, guild)}
                </span>
            )}
            {title && (
                <span className={styles['title']}>
                    {url ? (
                        <a 
                            href={url}
                            target="_blank"
                            referrerPolicy={'no-referrer'}
                        >
                            {replaceVariables(title, user, guild)}
                        </a>
                    ) : replaceVariables(title, user, guild)}
                </span>
            )}
            {description && (
                <span className={styles['description']}>
                    {replaceVariables(description, user, guild)}
                </span>
            )}
            {validFields.length !== 0 && (
                <div className={styles['fields']}>
                    {validFields.map((field, index) => (
                        <div 
                            className={`${styles['field']} ${field.inline ? styles['inline'] : ''}`} 
                            key={index}
                        >
                            <span className={styles['field-name']}>
                                {field.name}
                            </span>
                            <span className={styles['field-value']}>
                                {field.value}
                            </span>
                        </div>
                    ))}
                </div>
            )}
            {footer.text && (
                <span className={styles['footer']}>
                    {footer.icon && (
                        <img 
                            src={replaceVariables(footer.icon, user, guild)}
                            alt=""
                        />
                    )}
                    {replaceVariables(footer.text, user, guild)}
                </span>
            )}
        </div>
    )
}