import styles from './Overview.module.scss';
import { useGuildId } from "@/hooks/useGuildId";
import { Activity, Channel, ReduxLogs } from "@/types";
import React, {useRef } from "react"
import { ModuleSubheader } from '../module-subheader';
import { getRelativeTime } from '@/utils';
import Image from 'next/image';
import Link from 'next/link';
import { LoggingIcon } from '@/assets/icons/LoggingIcon';
import { HandIcon } from '@/assets/icons/HandIcon';
import { HammerIcon } from '@/assets/icons/HammerIcon';
import { useInfiniteScrolling } from '@/hooks/useInfiniteScrolling';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { selectActivity } from '@/redux/dashboard/selectors';
import { addActivity } from '@/redux/dashboard/actions';

const getLogType = (property: keyof ReduxLogs['logChannels']) => (
    property === 'all_logs_channel' ? 'general log channel' : `${property.split('_')[0]} log channel`
)

const PLACEHOLDER_COUNT = 4;
const getActionText = (actionId: Activity['action_id'], property: Activity['changes'][0]['property'], prevSettings: Activity['changes'][0]['previous_value'], newSettings: Activity['changes'][0]['new_value']) => {
    if(property.includes('channel')) {
        if(actionId === 'logging') {
            return `Updated ${getLogType(property as keyof ReduxLogs['logChannels'])}`;
        }
        if(actionId === 'welcome' || actionId === 'goodbye') {
            return `Updated ${actionId} channel`;
        }
    }
    if(property.includes('message')) {
        if(['welcome', 'goodbye'].includes(actionId)) {
            return [
                <span key={0}>Changed {actionId} message from </span>,
                <span key={1} className={styles['activity-highlight']}>{(prevSettings as string | null) || <i>text unset</i>}</span>,
                <span key={2}>to</span>,
                <span key={3} className={styles['activity-highlight']}>{(newSettings as string | null) || <i>text unset</i>}</span>,
            ]
        }
    }
    if(property === 'isEnabled') {
        return `${prevSettings ? 'Disabled' : 'Enabled'} the ${actionId} module.`
    }
    if(property === 'dm') {
        return [
            <span key={0}>Changed welcome direct message from</span>,
            <span key={1} className={styles['activity-highlight']}>{prevSettings as string}</span>,
            <span key={2}>to</span>,
            <span key={3} className={styles['activity-highlight']}>{newSettings as string}</span>,
        ]

    }
    if(actionId === 'moderation') {
        if(['discord', 'twitter', 'facebook', 'instagram', 'twitch', 'youtube'].includes(property)) {
            return`${prevSettings ? 'Disabled' : 'Enabled'} link removal of ${property} links`
        }
        if(property === 'ephemeral') {
            return `${prevSettings ? 'Disabled' : 'Enabled'} ${property} in moderation settings.`
        }
        if(property === 'sendDMs') {
            return `${prevSettings ? 'Disabled' : 'Enabled'} direct messages upon recieving a punishment.`
        }
        if(property === 'incReason') {
            return `${prevSettings ? 'Disabled' : 'Enabled'} reason being included in punishment DMs.`
        }
        if(property === 'confirmation') {
            return `${prevSettings ? 'Disabled' : 'Enabled'} confirmation upon moderation actions.`
        }
    }
    return 'Text not set: ' + `(${actionId}, ${property})`
}
const getActionIcon = (actionId: Activity['action_id']) => {
    switch(actionId) {
        case 'logging':
            return <LoggingIcon />;
            break;
        case 'goodbye':
        case 'welcome':
            return <HandIcon />;
            break;
        case 'moderation':
            return <HammerIcon />;
            break;
    }
}
const getModulePath = (guildId: string, actionId: Activity['action_id']) => {
    let path: string = actionId;
    if(['welcome', 'goodbye'].includes(path)) path = 'greetings';
    return `/dashboard/${guildId}/${path}`
}

export const OverviewActivity = () => {
    const guildId = useGuildId();

    const dispatch = useAppDispatch();
    const activity = useAppSelector(state => selectActivity(state, guildId));

    const ref = useRef<HTMLUListElement>(null);

    const onRequestFinished = (activity: Activity[]) => (
        dispatch(addActivity(guildId, activity))
    )
    const { loading } = useInfiniteScrolling<Activity[]>(
        `/guilds/${guildId}/activity?start_at=${activity?.length || 0}`, 
        onRequestFinished, 
        {
            fetchAmount: 7,
            threshold: 300,
            scrollContainer: ref,
            fetchOnMount: true,
            identifier: `${guildId}-activity`,
        }
    )
    
    return(
        <div className={styles['activity']}>
            <ModuleSubheader
                extraHeader={(!loading && activity.length === 0) ? 'There is no recent activity on this server.' : undefined}
                className={styles['label']}
            >
                Activity
            </ModuleSubheader>

            {(loading || activity.length > 0) && (
                <ul className={styles['activity-list']} ref={ref}>
                    {activity?.map((activity, idx) => (
                        <li className={styles['activity-item']} key={idx}>
                            <div className={styles['activity-header']}>
                                <Image 
                                    src={activity.user.avatar}
                                    width={26}
                                    height={26}
                                    alt=""
                                />
                                <span className={styles['activity-text']}>
                                    <span className={styles['activity-username']}>
                                        {activity.user.global_name}
                                    </span>
                                    {' '}
                                    made {activity.changes.length} change{activity.changes.length > 1 ? 's' : ''} to the
                                    {' '}
                                    <Link href={getModulePath(guildId, activity.action_id)}>
                                        {activity.action_id.split('-').join(' ')}
                                    </Link>
                                    {' '}
                                    module.
                                </span>
                                <span className={styles['activity-timestamp']}>
                                    {getRelativeTime(activity.timestamp).readableDate}
                                </span>
                            </div>

                            <div className={styles['activity-content']}>
                                {activity.changes.map((change, index) => {
                                    const icon = getActionIcon(activity.action_id);
                                    const text = getActionText(activity.action_id, change.property, change.previous_value, change.new_value);

                                    return(
                                        <div className={styles['activity-change']} key={index}>
                                            {icon}
    
                                            {(index + 1).toString().padStart(2, '0')} -
                                            {' '}
                                            {text}
                                            
                                            {change.property.includes('channel') && (
                                                <div className={styles['activity-flex']}>
                                                    <div className={styles['activity-highlight']}>
                                                        # {(change.previous_value as Channel | null)?.name || <i>channel-unset</i>}
                                                    </div>
                                                    {' --> '}
                                                    <div  className={styles['activity-highlight']}>
                                                        # {(change.new_value as Channel | null)?.name || <i>channel-unset</i>}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </li>
                    ))}
                    {loading && (
                        Array.from(Array(PLACEHOLDER_COUNT)).map((_, key) => (
                            <li className={`${styles['activity-item']} ${styles['activity-skeleton']}`} key={key}>
                                <div className={styles['activity-header']}>
                                    <div className={styles['activity-user-icon']} />
                                    <div className={styles['activity-text-skeleton']} />
                                </div>
                                <ul className={styles['activity-list']}>
                                    {Array.from(Array(2)).map((__, index) => (
                                        <li key={index}>
                                            <div className={styles['activity-text-skeleton']} />
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    )
}