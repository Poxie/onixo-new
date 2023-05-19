import { OverviewIcon } from '@/assets/icons/OverviewIcon';
import styles from './DashboardLayout.module.scss';
import { HammerIcon } from '@/assets/icons/HammerIcon';
import { HandIcon } from '@/assets/icons/HandIcon';
import { useRouter } from 'next/router';
import Link from 'next/link';

const TABS = [
    { text: 'Overview', path: '', icon: <OverviewIcon /> },
    { text: 'Moderation', path: '/moderation', icon: <HammerIcon /> },
    { text: 'Welcomes & Goodbyes', path: '/greetings', icon: <HandIcon /> },
]

export const SidebarTabs = () => {
    const router = useRouter();
    const asPath = router.asPath;
    const { guildId } = router.query as { guildId: string };

    return(
        <ul className={styles['tabs']}>
            {TABS.map(tab => {
                const path = `/dashboard/${guildId}${tab.path}`;
                const isActive = path === asPath;

                const className = [
                    styles['tab'],
                    isActive ? styles['active'] : ''
                ].join(' ');
                return(
                    <li key={tab.text}>
                        <Link 
                            className={className}
                            href={path}
                        >
                            {tab.icon}
                            <span>
                                {tab.text}
                            </span>
                        </Link>
                    </li>
                )
            })}
        </ul>
    )
}