import { ModuleSection } from '../../module-section';
import { ModuleSubheader } from '../../module-subheader';
import styles from '../Moderation.module.scss';
import settingsStyles from './ModSettings.module.scss';
import { SettingsItem } from './SettingsItem';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { useGuildId } from '@/hooks/useGuildId';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { selectGuildModSettings, selectModSettingsFetched } from '@/redux/dashboard/selectors';
import { ReduxModSettings } from '@/types';
import { setModSettings } from '@/redux/dashboard/actions';

export const ModSettings = () => {
    const guildId = useGuildId();
    const { token, get } = useAuth();

    const dispatch = useAppDispatch();
    const settings = useAppSelector(state => selectGuildModSettings(state, guildId));
    
    useEffect(() => {
        if(!token || settings) return;

        get<ReduxModSettings['settings']>(`/guilds/${guildId}/mod-settings`, 'backend')
            .then(settings => {
                dispatch(setModSettings(guildId, settings));
            })
    }, [token, get, guildId, settings]);

    return(
        <ModuleSection
            header={'Moderation settings'}
            description={'Here you can update settings to change the display and behavior of our moderation commands and logging. These settings apply to all moderation actions and logs.'}
            className={styles['section']}
        >
            <div>
                <ModuleSubheader>
                    Command usage
                </ModuleSubheader>
                <div className={settingsStyles['section']}>
                    <SettingsItem 
                        id={'ephemeral'}
                        title={'Ephemeral'}
                        description={'Turn moderation commands ephemeral so only the command author can see the response given from the bot.'}
                        checked={settings?.ephemeral}
                    />
                    <SettingsItem 
                        id={'confirmation'}
                        title={'Confirmation'}
                        description={'Include a message confirmation when running moderation commands.'}
                        checked={settings?.confirmation}
                    />
                </div>
                <ModuleSubheader>
                    Notify user by DMs
                </ModuleSubheader>
                <div className={settingsStyles['section']}>
                    <SettingsItem 
                        id={'sendDMs'}
                        title={'Send DMs'}
                        description={'Send a DM to the user being punished informing them of their punishment.'}
                        checked={settings?.sendDMs}
                    />
                    <SettingsItem 
                        id={'incName'}
                        title={'Include Name'}
                        description={'Include the name of the staff member when sending a DM to the user being punished.'}
                        checked={settings?.incName}
                    />
                    <SettingsItem 
                        id={'incReason'}
                        title={'Include Reason'}
                        description={'Include the reason of the punishment when sending a DM to the user being punished.'}
                        checked={settings?.incReason}
                    />
                </div>
            </div>
        </ModuleSection>
    )
}