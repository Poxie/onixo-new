import styles from './ActionLogs.module.scss';
import { ModuleSection } from "../../module-section"
import { ModuleSubsection } from '../../module-subsection';
import { ItemList } from '../../item-list';
import { useAuth } from '@/contexts/auth';
import { useGuildId } from '@/hooks/useGuildId';
import { ActionLog } from './ActionLog';
import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { setActionLogs, updateActionLog } from '@/redux/dashboard/actions';
import { ReduxActionLogs } from '@/types';
import { selectActionLogs, selectGuildActionLog } from '@/redux/dashboard/selectors';
import { NextPageWithLayout } from '@/pages/_app';
import { DashAuthLayout } from '@/layouts/dash-auth';
import { DashboardLayout } from '@/layouts/dashboard';
import { ModerationLayout } from '@/layouts/moderation';
import { useConfirmation } from '@/contexts/confirmation';

const getPropertiesToUpdate = (tempSettings: ReduxActionLogs['logChannels'], prevSettings: ReduxActionLogs['logChannels']) => {
    const propertiesToUpdate: {[key: string]: any} = {};
    Object.entries(tempSettings).forEach(([key, value]) => {
        if(!prevSettings) return;
        
        const isSame = JSON.stringify(prevSettings[key as keyof typeof prevSettings]) === JSON.stringify(value);
        if(!isSame) {
            propertiesToUpdate[key] = value;
        }
    });
    return propertiesToUpdate;
}

type Action = 'all' | 'ban' | 'kick' | 'mute' | 'warn';
const SPECIFIC_LOG_CHANNELS = ['ban', 'kick', 'mute', 'warn'].map(type => `${type}_log_channel` as keyof Omit<ReduxActionLogs['logChannels'], 'all_logs_channel'>);
export const ActionLogs: NextPageWithLayout = () => {
    const guildId = useGuildId();
    const { token, get, patch } = useAuth();
    const { addChanges, removeChanges, setIsLoading, reset } = useConfirmation();

    const dispatch = useAppDispatch();
    const actionLogs = useAppSelector(state => selectActionLogs(state, guildId));

    const prevActionLogs = useRef(actionLogs);
    const tempActionLogs = useRef(actionLogs);

    useEffect(() => {
        if(!token || !guildId || actionLogs) return;

        get<ReduxActionLogs['logChannels']>(`/guilds/${guildId}/action-logs`, 'backend')
            .then(channels => {
                dispatch(setActionLogs(guildId, channels));
                prevActionLogs.current = structuredClone(channels);
                tempActionLogs.current = structuredClone(channels);
            })
    }, [get, guildId, actionLogs?.all_logs_channel]);

    const sendUpdateRequest = () => {
        if(!tempActionLogs.current || !prevActionLogs.current) return;
        const properties = getPropertiesToUpdate(tempActionLogs.current, prevActionLogs.current);

        setIsLoading(true);
        patch<ReduxActionLogs['logChannels']>(`/guilds/${guildId}/action-logs`, properties)
            .then(actionLogs => {
                dispatch(setActionLogs(guildId, actionLogs));
                prevActionLogs.current = structuredClone(actionLogs);
                tempActionLogs.current = structuredClone(actionLogs);
            })
            .catch(error => {
                console.error(error);
            })
            .finally(reset)
    }
    const revertChanges = () => {
        if(!prevActionLogs.current) return;

        tempActionLogs.current = structuredClone(prevActionLogs.current);
        dispatch(setActionLogs(guildId, structuredClone(prevActionLogs.current)));
    }

    const updateChannel = (action: keyof ReduxActionLogs['logChannels'], channelId: string | null) => {
        if(!tempActionLogs.current || !prevActionLogs.current) return;

        // Updating UI with new channel
        dispatch(updateActionLog(guildId, action, channelId))

        tempActionLogs.current[action] = channelId

        const hasChanges = getPropertiesToUpdate(tempActionLogs.current, prevActionLogs.current);
        if(!hasChanges) {
            removeChanges('action-logs');
        } else {
            addChanges({
                id: 'action-logs',
                onCancel: revertChanges,
                onConfirm: sendUpdateRequest,
            })
        }
    }

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
                    onChange={itemId => updateChannel('all_logs_channel', itemId)}
                    defaultActive={actionLogs?.all_logs_channel}
                    loading={actionLogs === undefined}
                />
            </ModuleSubsection>
            <ModuleSubsection className={className}>
                {SPECIFIC_LOG_CHANNELS.map(type => (
                    <ActionLog 
                        type={type}
                        onChange={channelId => updateChannel(type, channelId)}
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