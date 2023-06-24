import { OverviewIcon } from '@/assets/icons/OverviewIcon';
import styles from './DashboardLayout.module.scss';
import { HammerIcon } from '@/assets/icons/HammerIcon';
import { HandIcon } from '@/assets/icons/HandIcon';
import { useRouter } from 'next/router';
import Link from 'next/link';

const GROUPS: {
    title: string | undefined;
    tabs: { text: string, path: string, icon: any, href?: string }[]
}[] = [
    {
        title: undefined,
        tabs: [
            { text: 'Overview', path: '', icon: <OverviewIcon /> },
            { text: 'Moderation', path: '/moderation', href: 'automod', icon: <HammerIcon /> },
            { text: 'Welcomes & Goodbyes', path: '/greetings', icon: <HandIcon /> },
        ]
    },
    {
        title: 'Utilities',
        tabs: [
            { text: 'Embed Messages', path: '/embeds', icon: <OverviewIcon /> },
            { text: 'Infractions', path: '/infractions', icon: <OverviewIcon /> }
        ]
    }
]

export const SidebarTabs = () => {
    const router = useRouter();
    const asPath = router.asPath;
    const { guildId } = router.query as { guildId: string };

    return(
        <ul className={styles['groups']}>
            {GROUPS.map(group => (
                <ul 
                    data-group-title={group.title} 
                    className={styles['tabs']}
                    key={group.title || '0'}
                >
                    {group.tabs.map(tab => {
                        const path = `/dashboard/${guildId}${tab.path}/${tab.href ? tab.href : ''}`;
                        const isActive = !tab.path ? asPath === `/dashboard/${guildId}` : asPath.includes(tab.path);

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
            ))}
        </ul>
    )
}