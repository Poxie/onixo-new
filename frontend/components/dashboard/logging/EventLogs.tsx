import styles from './Logging.module.scss';
import { ReduxLogs } from "@/types";
import { ModuleSection } from "../module-section"
import { useHasChanges } from "@/hooks/useHasChanges";
import { setActionLogs, updateActionLog } from "@/redux/dashboard/actions";
import { selectLogs } from "@/redux/dashboard/selectors";
import { useGuildId } from "@/hooks/useGuildId";
import { ModuleSubsection } from "../module-subsection";
import { useAppSelector } from '@/redux/store';
import { LogItem } from './LogItem';

type Action = 'message' | 'channel' | 'user' | 'server' | 'voice';
const LOG_CHANNELS = ['message', 'channel', 'user', 'server', 'voice'].map(type => `${type}_log_channel` as keyof Omit<ReduxLogs['logChannels'], 'all_logs_channel'>);
export const EventLogs = () => {
    const guildId = useGuildId();

    const logs = useAppSelector(state => selectLogs(state, guildId));

    const { updateProperty } = useHasChanges<ReduxLogs['logChannels']>({
        guildId,
        id: 'event-logs',
        dispatchAction: setActionLogs,
        updateAction: updateActionLog,
        selector: selectLogs,
        endpoint: `/guilds/${guildId}/action-logs`,
    })
    
    return(
        <ModuleSection
            header={'Event logging'}
            description={'Decide where logs for certain events show up in your server.'}
            className={styles['container']}
        >
            <ModuleSubsection className={`${styles['multi-section']} ${logs?.all_logs_channel ? styles['disabled'] : ''}`}>
                {LOG_CHANNELS.map(type => (
                    <LogItem 
                        onChange={channelId => updateProperty(type, channelId)}
                        active={logs ? logs[type] : undefined}
                        type={type}
                        key={type}
                    />
                ))}
            </ModuleSubsection>
        </ModuleSection>
    )
}