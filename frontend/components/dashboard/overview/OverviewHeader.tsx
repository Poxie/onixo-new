import styles from './Overview.module.scss';
import { ModuleSubheader } from "../module-subheader"
import { useGuildId } from '@/hooks/useGuildId';
import { useAppSelector } from '@/redux/store';
import { selectGuildById } from '@/redux/dashboard/selectors';
import Image from 'next/image';
import { getGuildIcon } from '@/utils/getImages';
import { GuildIcon } from '@/components/guild-icon';

export const OverviewHeader = () => {
    const guildId = useGuildId();
    const guild = useAppSelector(state => selectGuildById(state, guildId));

    if(!guild) return null;
    
    return(
        <header className={styles['header']}>
            <ModuleSubheader>
                Overview for
            </ModuleSubheader>
            <div className={styles['header-guild']}>
                <GuildIcon 
                    guildId={guildId}
                    icon={guild.icon}
                    name={guild.name}
                    className={styles['header-icon']}
                />
                <span>
                    {guild.name}
                </span>
            </div>
        </header>
    )
}