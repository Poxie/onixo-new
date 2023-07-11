import styles from './Overview.module.scss'; 
import { HammerIcon } from "@/assets/icons/HammerIcon"
import { HandIcon } from "@/assets/icons/HandIcon"
import { LoggingIcon } from '@/assets/icons/LoggingIcon';
import { PremiumIcon } from '@/assets/icons/PremiumIcon';
import { useGuildId } from "@/hooks/useGuildId"
import Link from "next/link"
import { ModuleSubheader } from '../module-subheader';

const modules = [
    { text: 'Moderation', icon: <HammerIcon />, path: 'moderation/automod' },
    { text: 'Logging', icon: <LoggingIcon />, path: 'logging' },
    { text: 'Welcomes & Goodbyes', icon: <HandIcon />, path: 'greetings' },
    { text: 'Premium', icon: <PremiumIcon />, path: 'premium' },
]

export const OverviewModules = () => {
    const guildId = useGuildId();

    return(
        <div className={styles['modules']}>
            <ModuleSubheader>
                Modules
            </ModuleSubheader>
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
        </div>
    )
}