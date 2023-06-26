import styles from './Greetings.module.scss';
import { ModuleSection } from "../module-section"
import { ModuleSubheader } from '../module-subheader';
import { ItemList } from '../item-list';
import { Input } from '@/components/input';
import { MessagePreview } from '../message-preview';
import { ReduxGoodbyeSettings } from '@/types';
import { useGuildId } from '@/hooks/useGuildId';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { selectChannelById, selectGoodbyeSettings } from '@/redux/dashboard/selectors';
import { MutableRefObject, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/auth';
import { setGoodbyeSettings, updateGoodbyeSetting } from '@/redux/dashboard/actions';
import { useHasChanges } from '@/hooks/useHasChanges';

export const Goodbyes = () => {
    const { token, get } = useAuth();
    const guildId = useGuildId();
    const dispatch = useAppDispatch();

    const goodbye = useAppSelector(state => selectGoodbyeSettings(state, guildId));
    const channel = useAppSelector(state => selectChannelById(state, guildId, goodbye?.settings.channel as string));

    const tempSettings = useRef(goodbye?.settings);
    const prevSettings = useRef(goodbye?.settings);

    const { updateProperty } = useHasChanges<ReduxGoodbyeSettings['settings']>({
        guildId,
        id: 'goodbye',
        endpoint: `/guilds/${guildId}/goodbye`,
        dispatchAction: setGoodbyeSettings,
        updateAction: updateGoodbyeSetting,
        prevSettings: prevSettings as MutableRefObject<ReduxGoodbyeSettings['settings']>,
        tempSettings: tempSettings as MutableRefObject<ReduxGoodbyeSettings['settings']>,
    })

    useEffect(() => {
        if(!token || !guildId) return;

        get<ReduxGoodbyeSettings['settings']>(`/guilds/${guildId}/goodbye`, 'backend')
            .then(settings => {
                dispatch(setGoodbyeSettings(guildId, structuredClone(settings)));
                tempSettings.current = structuredClone(settings);
                prevSettings.current = structuredClone(settings);
            })
    }, [token, get, guildId]);

    return(
        <ModuleSection
            header={'Goodbyes'}
            description={'Give your ex-members a farewell message.'}
            className={styles['section']}
        >
            <div className={styles['flex']}>
                <div>
                    <ModuleSubheader 
                        extraHeader={'Ex-members will be farewelled in this channel.'}
                    >
                        Goodbye channel
                    </ModuleSubheader>
                    <ItemList 
                        onChange={channelId => updateProperty('channel', channelId)}
                        defaultActive={goodbye?.settings.channel}
                        loading={goodbye === undefined}
                    />
                    <ModuleSubheader
                        extraHeader={'Enter a message below to farewell ex-members.'}
                        className={styles['header']}
                    >
                        Goodbye message
                    </ModuleSubheader>
                    <Input 
                        loading={goodbye === undefined}
                        placeholder={'Goodbye message'}
                        onChange={message => updateProperty('message', message)}
                        defaultValue={goodbye?.settings.message}
                        textArea
                    />
                </div>
                <MessagePreview 
                    message={goodbye?.settings.message}
                    placeholder={'Enter a goodbye message.'}
                    channelName={`# ${channel?.name || 'channel-not-selected'}`}
                    loading={goodbye === undefined}
                />
            </div>
        </ModuleSection>
    )
}