import styles from './Overview.module.scss';
import { ModuleSubheader } from "../module-subheader"
import { useGuildId } from '@/hooks/useGuildId';
import { useAppSelector } from '@/redux/store';
import Image from 'next/image';
import { getGuildIcon } from '@/utils/getImages';
import { GuildIcon } from '@/components/guild-icon';
import { selectGuildById } from '@/redux/slices/dashboard';

export const OverviewHeader = () => {
    const guildId = useGuildId();
    const guild = useAppSelector(state => selectGuildById(state, guildId));
    
    return(
        <header className={styles['header']}>
            <ModuleSubheader>
                Overview for
            </ModuleSubheader>
            <div className={styles['header-guild']}>
                {guild ? (
                    <>
                    <GuildIcon 
                        guildId={guildId}
                        icon={guild.icon}
                        name={guild.name}
                        className={styles['header-icon']}
                    />
                    <span>
                        {guild.name}
                    </span>
                    </>
                ) : (
                    <>
                    <div className={`${styles['header-icon']} ${styles['loading-icon']}`} />
                    <div className={styles['loading-text']} />
                    </>
                )}
            </div>
        </header>
    )
}