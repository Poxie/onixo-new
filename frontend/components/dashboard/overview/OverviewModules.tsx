import styles from './Overview.module.scss'; 
import { HammerIcon } from "@/assets/icons/HammerIcon"
import { HandIcon } from "@/assets/icons/HandIcon"
import { LoggingIcon } from '@/assets/icons/LoggingIcon';
import { useGuildId } from "@/hooks/useGuildId"
import Link from "next/link"

const modules = [
    { text: 'Moderation', icon: <HammerIcon />, path: 'moderation/automod' },
    { text: 'Logging', icon: <LoggingIcon />, path: 'logging' },
    { text: 'Welcomes & Goodbyes', icon: <HandIcon />, path: 'greetings' },
]

export const OverviewModules = () => {
    const guildId = useGuildId();

    return(
        <ul className={styles['module-list']}>
            {modules.map(module => (
                <li key={module.path}>
                    <Link 
                        href={`/dashboard/${guildId}/${module.path}`}
                        className={styles['module-item']}
                        aria-label={module.text}
                    >
                        {module.icon}
                        {module.text}
                    </Link>
                </li>
            ))}
        </ul>
    )
}