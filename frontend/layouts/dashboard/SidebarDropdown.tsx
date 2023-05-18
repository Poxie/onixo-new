import { GuildIcon } from '@/components/guild-icon';
import styles from './DashboardLayout.module.scss';
import { selectGuildById, selectGuilds } from "@/redux/dashboard/selectors";
import { useAppSelector } from "@/redux/store";
import Link from 'next/link';
import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import { getInviteLink } from '@/utils/getLinks';
import { ArrowIcon } from '@/assets/icons/ArrowIcon';
import { SidebarDropdownSkeleton } from './SidebarDropdownSkeleton';

export const SidebarDropdown = () => {
    const router = useRouter();
    const asPath = router.asPath;
    const { guildId } = router.query as { guildId: string };

    const [active, setActive] = useState(guildId);
    const [open, setOpen] = useState(false);

    const guilds = useAppSelector(selectGuilds);
    const activeGuild = useAppSelector(state => selectGuildById(state, active));

    useEffect(() => {
        setActive(guildId);
        setOpen(false);
    }, [guildId]);

    if(!activeGuild) return <SidebarDropdownSkeleton />;

    const invitedGuilds = guilds?.filter(guild => guild.invited);
    const notInvitedGuilds = guilds?.filter(guild => !guild.invited);

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
                <div className={styles['dd-items']}>
                    {invitedGuilds && (
                        <>
                        <span className={styles['dd-header']}>
                            Invited
                        </span>
                        <ul>
                            {invitedGuilds.map(guild => {
                                const splitPath = asPath.split('/');
                                const extraPath = splitPath.slice(3, splitPath.length).join('/');

                                return(
                                    <li key={guild.id}>
                                        <Link
                                            className={styles['dd-item']}
                                            href={`/dashboard/${guild.id}/${extraPath}`}
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
                        </>
                    )}
                    {notInvitedGuilds && (
                        <>
                        <span className={styles['dd-header']}>
                            Invite now
                        </span>
                        <ul>
                            {notInvitedGuilds.map(guild => {
                                return(
                                    <li key={guild.id}>
                                        <Link
                                            className={styles['dd-item']}
                                            href={getInviteLink(guild.id)}
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
                        </>
                    )}
                </div>
            )}
        </div>
    )
}