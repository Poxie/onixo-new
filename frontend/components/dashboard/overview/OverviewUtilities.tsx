import styles from './Overview.module.scss';
import { ModuleSubheader } from "../module-subheader"
import { EmbedIcon } from '@/assets/icons/EmbedIcon';
import { InfractionIcon } from '@/assets/icons/InfractionIcon';
import { useGuildId } from '@/hooks/useGuildId';
import Link from 'next/link';

const UTILITIES = [
    { text: 'Embed messages', path: 'embeds', icon: <EmbedIcon /> },
    { text: 'Infractions', path: 'infractions', icon: <InfractionIcon /> },
]
export const OverviewUtilities = () => {
    const guildId = useGuildId();

    return(
        <div className={styles['header']}>
            <ModuleSubheader>
                Utilities
            </ModuleSubheader>
            <ul className={styles['list']}>
                {UTILITIES.map(utility => (
                    <Link
                        href={`/dashboard/${guildId}/${utility.path}`}
                        className={styles['list-item']}
                        aria-label={utility.text}
                        key={utility.path}
                    >
                        {utility.icon}
                        <span>
                            {utility.text}
                        </span>
                    </Link>
                ))}
            </ul>
        </div>
    )
}