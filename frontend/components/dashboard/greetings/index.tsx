import styles from './Greetings.module.scss';
import { DashAuthLayout } from "@/layouts/dash-auth"
import { DashboardLayout } from "@/layouts/dashboard"
import { NextPageWithLayout } from "@/pages/_app"
import { ModuleHeader } from "../module-header"
import { ModuleSection } from "../module-section"
import { ItemList } from '../item-list';
import { ModuleSubheader } from '../module-subheader';
import { Input } from '@/components/input';
import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { selectChannelById, selectGuildById, selectWelcomeSettings } from '@/redux/dashboard/selectors';
import { useGuildId } from '@/hooks/useGuildId';
import { useAuth } from '@/contexts/auth';
import { MessagePreview } from '../message-preview';
import { ReduxWelcomeSettings } from '@/types';
import { setWelcomeSettings, updateWelcomeSetting } from '@/redux/dashboard/actions';

export const Greetings: NextPageWithLayout = () => {
    const guildId = useGuildId();
    const dispatch = useAppDispatch();
    const { user, get, patch, token } = useAuth();

    const welcome = useAppSelector(state => selectWelcomeSettings(state, guildId))
    const channel = useAppSelector(state => selectChannelById(state, guildId, welcome?.settings.channel as string));
    const guild = useAppSelector(state => selectGuildById(state, guildId));

    const tempSettings = useRef(welcome?.settings);

    useEffect(() => {
        if(!token || !guildId) return;

        get<ReduxWelcomeSettings['settings']>(`/guilds/${guildId}/welcome`, 'backend')
            .then(settings => {
                dispatch(setWelcomeSettings(guildId, settings));
                tempSettings.current = settings;
            })
    }, [token, get, guildId]);

    const sendUpdateRequest = (channelId?: string) => {
        if(!welcome || !tempSettings.current) return;

        // Determining what properties need to update
        const propertiesToUpdate: {[key: string]: string} = {};
        Object.entries(tempSettings.current).forEach(([key, value]) => {
            const isSame = welcome.settings[key as keyof typeof welcome.settings] === value;
            if(!isSame) {
                propertiesToUpdate[key] = welcome.settings[key as keyof typeof welcome.settings];
            }
        });
        
        // If channelId is present
        if(channelId !== undefined && (typeof channelId === 'string' || channelId === null)) propertiesToUpdate['channel'] = channelId as string;

        // Checking if there are any properties to update
        if(!Object.keys(propertiesToUpdate).length) return;

        // Updating properties
        patch(`/guilds/${guildId}/welcome`, propertiesToUpdate)
            .then(() => {
                tempSettings.current = welcome.settings;
            })
            .catch(() => {
                if(!tempSettings.current) return;

                // If request fails, restore to previous settings
                dispatch(setWelcomeSettings(guildId, tempSettings.current))
            })
    }
    const updateProperty = (property: keyof ReduxWelcomeSettings['settings'], value: any) => {
        dispatch(updateWelcomeSetting(guildId, property, value));
        if(property === 'channel') {
            sendUpdateRequest(value);
        }
    }

    if(!user || !guild) return null;
    return(
        <>
        <ModuleHeader 
            header={'Welcomes & Goodbyes'}
            subHeader={'Greet your new members with a welcoming message, a role or a DM. If they leave, send them a farewell message.'}
        />
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
                        onChange={channelId => updateProperty('channel', channelId)}
                        defaultActive={welcome?.settings.channel}
                    />
                    <ModuleSubheader
                        extraHeader={'Enter a message below to greet new members.'}
                        className={styles['header']}
                    >
                        Welcome message
                    </ModuleSubheader>
                    <Input 
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
                    channelName={`@ ${user.global_name}`}
                />
            </div>
        </ModuleSection>
        </>
    )
}

Greetings.getLayout = page => (
    <DashAuthLayout>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </DashAuthLayout>
)