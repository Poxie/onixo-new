import styles from '../Moderation.module.scss';
import logStyles from './ActionLogs.module.scss';
import { ModuleSection } from "../../module-section"
import { ModuleSubsection } from '../../module-subsection';
import { ItemList } from '../../item-list';
import { useAuth } from '@/contexts/auth';
import { useGuildId } from '@/hooks/useGuildId';
import { ActionLog } from './ActionLog';

export const ActionLogs = () => {
    const guildId = useGuildId();
    const { patch } = useAuth();

    const updateChannel = (action: string, channelId: string) => {
        patch(`/guilds/${guildId}/action-logs`, {
            action,
            channel_id: channelId
        })
    }

    return(
        <ModuleSection
            header={'Action logging'}
            description={'Decide where action logs should appear, if you decide they should appear at all.'}
            className={styles['section']}
        >
            <ModuleSubsection
                header={'General logging channel'}
                subHeader={'All logs will appear in this channel. This channel has priority over any action-specific logging channels below.'}
            >
                <ItemList 
                    onChange={itemId => updateChannel('all', itemId)}
                />
            </ModuleSubsection>
            <ModuleSubsection className={logStyles['multi-section']}>
                <ActionLog 
                    type={'ban'}
                    onChange={(type, channelId) => updateChannel(type, channelId)}
                />
                <ActionLog 
                    type={'kick'}
                    onChange={(type, channelId) => updateChannel(type, channelId)}
                />
                <ActionLog 
                    type={'mute'}
                    onChange={(type, channelId) => updateChannel(type, channelId)}
                />
                <ActionLog 
                    type={'warn'}
                    onChange={(type, channelId) => updateChannel(type, channelId)}
                />
            </ModuleSubsection>
        </ModuleSection>
    )
}