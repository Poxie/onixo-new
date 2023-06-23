import styles from './Greetings.module.scss';
import { Input } from "@/components/input"
import { ItemList } from "../item-list"
import { ModuleSection } from "../module-section"
import { ModuleSubheader } from "../module-subheader"
import { MessagePreview } from "../message-preview"
import { ReduxWelcomeSettings } from "@/types"
import { setWelcomeSettings, updateWelcomeSetting } from "@/redux/dashboard/actions"
import { useEffect, useRef, useState } from "react"
import { useGuildId } from "@/hooks/useGuildId"
import { useAppDispatch, useAppSelector } from "@/redux/store"
import { useAuth } from "@/contexts/auth"
import { selectChannelById, selectGuildById, selectWelcomeSettings } from "@/redux/dashboard/selectors"
import { RoleList } from '../role-list';

export const Welcomes = () => {
    const guildId = useGuildId();
    const dispatch = useAppDispatch();
    const { get, patch, token, user } = useAuth();

    const welcome = useAppSelector(state => selectWelcomeSettings(state, guildId))
    const channel = useAppSelector(state => selectChannelById(state, guildId, welcome?.settings.channel as string));

    const tempSettings = useRef(welcome?.settings);
    const prevSettings = useRef(welcome?.settings);

    useEffect(() => {
        if(!token || !guildId) return;

        get<ReduxWelcomeSettings['settings']>(`/guilds/${guildId}/welcome`, 'backend')
            .then(settings => {
                dispatch(setWelcomeSettings(guildId, settings));
                tempSettings.current = structuredClone(settings);
                prevSettings.current = structuredClone(settings);
            })
    }, [token, get, guildId]);

    const sendUpdateRequest = () => {
        if(!prevSettings.current || !tempSettings.current) return;

        // Determining what properties need to update
        const propertiesToUpdate: {[key: string]: string | string[]} = {};
        Object.entries(tempSettings.current).forEach(([key, value]) => {
            if(!prevSettings.current) return;
            
            const isSame = JSON.stringify(prevSettings.current[key as keyof typeof prevSettings.current]) === JSON.stringify(value);
            if(!isSame) {
                propertiesToUpdate[key] = value;
            }
        });

        // Checking if there are any properties to update
        if(!Object.keys(propertiesToUpdate).length) return;

        // Updating properties
        patch(`/guilds/${guildId}/welcome`, propertiesToUpdate)
            .then(() => {
                prevSettings.current = structuredClone(tempSettings.current);
            })
            .catch(() => {
                if(!tempSettings.current) return;

                // If request fails, restore to previous settings
                dispatch(setWelcomeSettings(guildId, tempSettings.current));
                tempSettings.current = structuredClone(prevSettings.current);
            })
    }
    const updateProperty = (property: keyof ReduxWelcomeSettings['settings'], value: any, shouldUpdateNow?: boolean) => {
        // Updating current settings
        if(tempSettings.current) {
            tempSettings.current[property] = value;
        }

        // Updating UI
        dispatch(updateWelcomeSetting(guildId, property, value));

        // If update request should be sent instantly
        if(shouldUpdateNow) {
            sendUpdateRequest();
        }
    }

    return(
        <ModuleSection
            header={'Welcomes'}
            description={'Greet your new members your way.'}
            className={styles['section']}
        >
            <div className={styles['flex']}>
                <div>
                    <ModuleSubheader 
                        extraHeader={'New members will be greeted in this channel.'}
                    >
                        Welcome channel
                    </ModuleSubheader>
                    <ItemList 
                        onChange={channelId => updateProperty('channel', channelId, true)}
                        defaultActive={welcome?.settings.channel}
                        loading={welcome === undefined}
                    />
                    <ModuleSubheader
                        extraHeader={'Enter a message below to greet new members.'}
                        className={styles['header']}
                    >
                        Welcome message
                    </ModuleSubheader>
                    <Input 
                        loading={welcome === undefined}
                        placeholder={'Welcome message'}
                        onChange={message => updateProperty('message', message)}
                        defaultValue={welcome?.settings.message}
                        onBlur={sendUpdateRequest}
                        textArea
                    />
                </div>
                <MessagePreview 
                    message={welcome?.settings.message}
                    placeholder={'Enter a welcome message.'}
                    channelName={`# ${channel?.name || 'channel-not-selected'}`}
                    loading={welcome === undefined}
                />
            </div>
            <div className={styles['flex']}>
                <div>
                    <ModuleSubheader
                        extraHeader={'Enter a message to send to new users\' DMs.'}
                    >
                        Welcome direct message
                    </ModuleSubheader>
                    <Input 
                        loading={welcome === undefined}
                        placeholder={'Direct Message'}
                        onChange={message => updateProperty('dm', message)}
                        defaultValue={welcome?.settings.dm}
                        onBlur={sendUpdateRequest}
                        textArea
                    />
                </div>
                <MessagePreview 
                    message={welcome?.settings.dm}
                    placeholder={'Enter a direct message.'}
                    channelName={`@ ${user?.global_name}`}
                    loading={welcome === undefined}
                />
            </div>
            <div className={styles['flex']}>
                <div>
                    <ModuleSubheader
                        extraHeader={'Select roles new members should receive.'}
                    >
                        Welcome member roles
                    </ModuleSubheader>
                    <RoleList 
                        active={welcome?.settings.users || []}
                        onChange={ids => updateProperty('users', ids, true)}
                        loading={welcome === undefined}
                    />
                </div>
                <div>
                    <ModuleSubheader
                        extraHeader={'Select roles new bots should receive.'}
                    >
                        Welcome bot roles
                    </ModuleSubheader>
                    <RoleList 
                        active={welcome?.settings.bots || []}
                        onChange={ids => updateProperty('bots', ids, true)}
                        loading={welcome === undefined}
                    />
                </div>
            </div>
        </ModuleSection>
    )
}