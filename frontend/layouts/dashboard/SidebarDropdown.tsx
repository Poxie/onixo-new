import { GuildIcon } from '@/components/guild-icon';
import styles from './DashboardLayout.module.scss';
import { selectGuildById, selectGuilds } from "@/redux/dashboard/selectors";
import { useAppSelector } from "@/redux/store";
import Link from 'next/link';
import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import { getInviteLink } from '@/utils/getLinks';
import { ArrowIcon } from '@/assets/icons/ArrowIcon';

export const SidebarDropdown = () => {
    const { guildId } = useRouter().query as { guildId: string };

    const [active, setActive] = useState(guildId);
    const [open, setOpen] = useState(false);

    const guilds = useAppSelector(selectGuilds);
    const activeGuild = useAppSelector(state => selectGuildById(state, active));

    useEffect(() => {
        setActive(guildId);
        setOpen(false);
    }, [guildId]);

    if(!activeGuild) return null;

    const selectedClassName = [
        styles['dd-item'],
        styles['dd-selected'],
        open ? styles['open'] : ''
    ].join(' ');
    return(
        <div className={styles['dropdown']}>
            <button 
                className={selectedClassName}
                onClick={() => setOpen(!open)}
            >
                <div className={styles['dd-selected-main']}>
                    <GuildIcon 
                        guildId={activeGuild.id}
                        name={activeGuild.name}
                        icon={activeGuild.icon}
                        className={styles['dd-icon']}
                    />
                    <span>
                        {activeGuild?.name}
                    </span>
                </div>
                <ArrowIcon />
            </button>

            {guilds && open && (
                <ul className={styles['dd-items']}>
                    {guilds.map(guild => {
                        const href = guild.invited ? `/dashboard/${guild.id}` : getInviteLink(guild.id);
                        return(
                            <li key={guild.id}>
                                <Link
                                    className={styles['dd-item']}
                                    href={href}
                                >
                                    <GuildIcon 
                                        guildId={guild.id}
                                        name={guild.name}
                                        icon={guild.icon}
                                        className={styles['dd-icon']}
                                    />
                                    <span>
                                        {guild.name}
                                    </span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}