import styles from './ActionLogs.module.scss';
import { ReduxActionLogs } from "@/types";
import { ModuleSection } from "../../module-section"
import { ActionLog } from "./ActionLog";
import { useHasChanges } from "@/hooks/useHasChanges";
import { setActionLogs, updateActionLog } from "@/redux/dashboard/actions";
import { selectActionLogs } from "@/redux/dashboard/selectors";
import { useGuildId } from "@/hooks/useGuildId";
import { ModuleSubsection } from "../../module-subsection";
import { useAppSelector } from '@/redux/store';

type Action = 'message' | 'channel' | 'user' | 'server' | 'voice';
const LOG_CHANNELS = ['message', 'channel', 'user', 'server', 'voice'].map(type => `${type}_log_channel` as keyof Omit<ReduxActionLogs['logChannels'], 'all_logs_channel'>);
export const EventLogs = () => {
    const guildId = useGuildId();

    const logs = useAppSelector(state => selectActionLogs(state, guildId));

    const { updateProperty } = useHasChanges<ReduxActionLogs['logChannels']>({
        guildId,
        id: 'event-logs',
        dispatchAction: setActionLogs,
        updateAction: updateActionLog,
        selector: selectActionLogs,
        endpoint: `/guilds/${guildId}/action-logs`,
    })
    
    return(
        <ModuleSection
            header={'Event logging'}
            description={'Decide where logs for certain events show up in your server.'}
            className={styles['container']}
        >
            <ModuleSubsection className={styles['multi-section']}>
                {LOG_CHANNELS.map(type => (
                    <ActionLog 
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