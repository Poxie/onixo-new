import styles from '../Moderation.module.scss';
import logStyles from './ActionLogs.module.scss';
import { ModuleSection } from "../../module-section"
import { ModuleSubsection } from '../../module-subsection';
import { ItemList } from '../../item-list';
import { useAuth } from '@/contexts/auth';
import { useGuildId } from '@/hooks/useGuildId';
import { ActionLog } from './ActionLog';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { addActionLogs, updateActionLog } from '@/redux/dashboard/actions';
import { ReduxActionLogs } from '@/types';
import { selectGuildActionLog } from '@/redux/dashboard/selectors';

export const ActionLogs = () => {
    const guildId = useGuildId();
    const { token, get, patch } = useAuth();

    const dispatch = useAppDispatch();
    const allActionsChannel = useAppSelector(state => selectGuildActionLog(state, guildId, 'all'));

    const updateChannel = (action: string, channelId: string | null) => {
        patch<ReduxActionLogs['logChannels']['all_logs_channel']>(`/guilds/${guildId}/action-logs`, {
            action,
            channel_id: channelId
        }).then(webhookData => {
            dispatch(updateActionLog(guildId, action, webhookData))
        })
    }

    useEffect(() => {
        if(!token || !guildId || allActionsChannel !== undefined) return;

        get<ReduxActionLogs['logChannels']>(`/guilds/${guildId}/action-logs`, 'backend')
            .then(channels => {
                dispatch(addActionLogs(guildId, channels));
            })
    }, [get, guildId, allActionsChannel]);

    const className = [
        logStyles['multi-section'],
        allActionsChannel ? logStyles['disabled'] : ''
    ].join(' ');
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
                    defaultActive={allActionsChannel ? allActionsChannel[0] : undefined}
                    loading={allActionsChannel === undefined}
                />
            </ModuleSubsection>
            <ModuleSubsection className={className}>
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