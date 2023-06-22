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
import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/auth';
import { setGoodbyeSettings, updateGoodbyeSetting } from '@/redux/dashboard/actions';

export const Goodbyes = () => {
    const { token, patch, get } = useAuth();
    const guildId = useGuildId();
    const dispatch = useAppDispatch();

    const goodbye = useAppSelector(state => selectGoodbyeSettings(state, guildId));
    const channel = useAppSelector(state => selectChannelById(state, guildId, goodbye?.settings.channel as string));

    const tempSettings = useRef(goodbye?.settings);

    useEffect(() => {
        if(!token || !guildId) return;

        get<ReduxGoodbyeSettings['settings']>(`/guilds/${guildId}/goodbye`, 'backend')
            .then(settings => {
                dispatch(setGoodbyeSettings(guildId, settings));
                tempSettings.current = settings;
            })
    }, [token, get, guildId]);

    const sendUpdateRequest = (channelId?: string) => {
        if(!goodbye || !tempSettings.current) return;

        // Determining what properties need to update
        const propertiesToUpdate: {[key: string]: string} = {};
        Object.entries(tempSettings.current).forEach(([key, value]) => {
            const isSame = goodbye.settings[key as keyof typeof goodbye.settings] === value;
            if(!isSame) {
                propertiesToUpdate[key] = goodbye.settings[key as keyof typeof goodbye.settings];
            }
        });
        
        // If channelId is present
        if(channelId !== undefined && (typeof channelId === 'string' || channelId === null)) propertiesToUpdate['channel'] = channelId as string;

        // Checking if there are any properties to update
        if(!Object.keys(propertiesToUpdate).length) return;

        // Updating properties
        patch(`/guilds/${guildId}/goodbye`, propertiesToUpdate)
            .then(() => {
                tempSettings.current = goodbye.settings;
            })
            .catch(() => {
                if(!tempSettings.current) return;

                // If request fails, restore to previous settings
                dispatch(setGoodbyeSettings(guildId, tempSettings.current))
            })
    }
    const updateProperty = (property: keyof ReduxGoodbyeSettings['settings'], value: any) => {
        dispatch(updateGoodbyeSetting(guildId, property, value));
        if(property === 'channel') {
            sendUpdateRequest(value);
        }
    }

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
                        onBlur={sendUpdateRequest}
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