import styles from './ActionLogs.module.scss';
import { ModuleSection } from "../../module-section"
import { ModuleSubsection } from '../../module-subsection';
import { ItemList } from '../../item-list';
import { useAuth } from '@/contexts/auth';
import { useGuildId } from '@/hooks/useGuildId';
import { ActionLog } from './ActionLog';
import { MutableRefObject, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { setActionLogs, updateActionLog } from '@/redux/dashboard/actions';
import { ReduxActionLogs } from '@/types';
import { selectActionLogs, selectGuildActionLog } from '@/redux/dashboard/selectors';
import { NextPageWithLayout } from '@/pages/_app';
import { DashAuthLayout } from '@/layouts/dash-auth';
import { DashboardLayout } from '@/layouts/dashboard';
import { ModerationLayout } from '@/layouts/moderation';
import { useHasChanges } from '@/hooks/useHasChanges';

type Action = 'all' | 'ban' | 'kick' | 'mute' | 'warn';
const SPECIFIC_LOG_CHANNELS = ['ban', 'kick', 'mute', 'warn'].map(type => `${type}_log_channel` as keyof Omit<ReduxActionLogs['logChannels'], 'all_logs_channel'>);
export const ActionLogs: NextPageWithLayout = () => {
    const guildId = useGuildId();
    const { token, get } = useAuth();

    const dispatch = useAppDispatch();
    const actionLogs = useAppSelector(state => selectActionLogs(state, guildId));

    const prevActionLogs = useRef(actionLogs);
    const tempActionLogs = useRef(actionLogs);

    const { updateProperty } = useHasChanges<ReduxActionLogs['logChannels']>({
        guildId,
        id: 'action-logs',
        dispatchAction: setActionLogs,
        updateAction: updateActionLog,
        endpoint: `/guilds/${guildId}/action-logs`,
        prevSettings: prevActionLogs as MutableRefObject<ReduxActionLogs['logChannels']>,
        tempSettings: tempActionLogs as MutableRefObject<ReduxActionLogs['logChannels']>,
    })

    useEffect(() => {
        if(!token || !guildId || actionLogs) return;

        get<ReduxActionLogs['logChannels']>(`/guilds/${guildId}/action-logs`, 'backend')
            .then(channels => {
                dispatch(setActionLogs(guildId, channels));
                prevActionLogs.current = structuredClone(channels);
                tempActionLogs.current = structuredClone(channels);
            })
    }, [get, guildId, actionLogs?.all_logs_channel]);

    const className = [
        styles['multi-section'],
        actionLogs?.all_logs_channel ? styles['disabled'] : ''
    ].join(' ');
    return(
        <ModuleSection
            header={'Action logging'}
            description={'Decide where action logs should appear, if you decide they should appear at all.'}
        >
            <ModuleSubsection
                header={'General logging channel'}
                subHeader={'All logs will appear in this channel. This channel has priority over any action-specific logging channels below.'}
            >
                <ItemList 
                    onChange={itemId => updateProperty('all_logs_channel', itemId)}
                    defaultActive={actionLogs?.all_logs_channel}
                    loading={actionLogs === undefined}
                />
            </ModuleSubsection>
            <ModuleSubsection className={className}>
                {SPECIFIC_LOG_CHANNELS.map(type => (
                    <ActionLog 
                        type={type}
                        onChange={channelId => updateProperty(type, channelId)}
                        active={actionLogs ? actionLogs[type] : undefined}
                        key={type}
                    />
                ))}
            </ModuleSubsection>
        </ModuleSection>
    )
}

ActionLogs.getLayout = page => (
    <DashAuthLayout>
        <DashboardLayout>
            <ModerationLayout>
                {page}
            </ModerationLayout>
        </DashboardLayout>
    </DashAuthLayout>
)