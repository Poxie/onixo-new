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
import { useConfirmation } from '@/contexts/confirmation';

const getPropertiesToUpdate = (tempSettings: ReduxGoodbyeSettings['settings'], prevSettings: ReduxGoodbyeSettings['settings']) => {
    const propertiesToUpdate: {[key: string]: string | string[]} = {};
    Object.entries(tempSettings).forEach(([key, value]) => {
        if(!prevSettings) return;
        
        const isSame = JSON.stringify(prevSettings[key as keyof typeof prevSettings]) === JSON.stringify(value);
        if(!isSame) {
            propertiesToUpdate[key] = value;
        }
    });
    return propertiesToUpdate;
}
export const Goodbyes = () => {
    const { addChanges, removeChanges, setIsLoading, reset } = useConfirmation();
    const { token, patch, get } = useAuth();
    const guildId = useGuildId();
    const dispatch = useAppDispatch();

    const goodbye = useAppSelector(state => selectGoodbyeSettings(state, guildId));
    const channel = useAppSelector(state => selectChannelById(state, guildId, goodbye?.settings.channel as string));

    const tempSettings = useRef(goodbye?.settings);
    const prevSettings = useRef(goodbye?.settings);

    useEffect(() => {
        if(!token || !guildId) return;

        get<ReduxGoodbyeSettings['settings']>(`/guilds/${guildId}/goodbye`, 'backend')
            .then(settings => {
                dispatch(setGoodbyeSettings(guildId, structuredClone(settings)));
                tempSettings.current = structuredClone(settings);
                prevSettings.current = structuredClone(settings);
            })
    }, [token, get, guildId]);

    const sendUpdateRequest = () => {
        if(!prevSettings.current || !tempSettings.current) return;

        // Determining what properties need to update
        const propertiesToUpdate = getPropertiesToUpdate(tempSettings.current, prevSettings.current);

        if(!Object.keys(propertiesToUpdate).length) return;

        // Updating properties
        setIsLoading(true);
        patch(`/guilds/${guildId}/goodbye`, propertiesToUpdate)
            .then(() => {
                prevSettings.current = structuredClone(tempSettings.current);
                reset();
            })
            .catch(() => {
                if(!tempSettings.current) return;

                // If request fails, restore to previous settings
                dispatch(setGoodbyeSettings(guildId, tempSettings.current));
                tempSettings.current = structuredClone(prevSettings.current);
            })
            .finally(reset);
    }
    const revertChanges = () => {
        if(!prevSettings.current) return;
        tempSettings.current = structuredClone(prevSettings.current);
        dispatch(setGoodbyeSettings(guildId, structuredClone(prevSettings.current)));
    }
    const updateProperty = (property: keyof ReduxGoodbyeSettings['settings'], value: any) => {
        if(!tempSettings.current || !prevSettings.current) return;
        
        // Updating current settings
        if(tempSettings.current) {
            tempSettings.current[property] = value;
        }

        // Determining what properties need to update
        const propertiesToUpdate = getPropertiesToUpdate(tempSettings.current, prevSettings.current);

        // Checking if there are any changes
        const isEmpty = Object.keys(propertiesToUpdate).length === 0;
        if(isEmpty) {
            removeChanges('goodbye');
        } else {
            addChanges({
                id: 'goodbye',
                onCancel: revertChanges,
                onConfirm: sendUpdateRequest,
            })
        }

        // Updating UI
        dispatch(updateGoodbyeSetting(guildId, property, value));
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