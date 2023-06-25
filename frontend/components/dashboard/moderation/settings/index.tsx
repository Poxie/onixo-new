import { ModuleSection } from '../../module-section';
import { ModuleSubheader } from '../../module-subheader';
import styles from './ModSettings.module.scss';
import { SettingsItem } from './SettingsItem';
import { useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/auth';
import { useGuildId } from '@/hooks/useGuildId';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { selectGuildModSettings, selectModSettingsFetched } from '@/redux/dashboard/selectors';
import { ReduxModSettings } from '@/types';
import { setModSettings, updateModSetting } from '@/redux/dashboard/actions';
import { DashAuthLayout } from '@/layouts/dash-auth';
import { DashboardLayout } from '@/layouts/dashboard';
import { ModerationLayout } from '@/layouts/moderation';
import { NextPageWithLayout } from '@/pages/_app';
import { useConfirmation } from '@/contexts/confirmation';

const getPropertiesToUpdate = (tempSettings: ReduxModSettings['settings'], prevSettings: ReduxModSettings['settings']) => {
    const propertiesToUpdate: {[key: string]: boolean | string[]} = {};
    Object.entries(tempSettings).forEach(([key, value]) => {
        if(!prevSettings) return;
        
        const isSame = JSON.stringify(prevSettings[key as keyof typeof prevSettings]) === JSON.stringify(value);
        if(!isSame) {
            propertiesToUpdate[key] = value;
        }
    });
    return propertiesToUpdate;
}

export const ModSettings: NextPageWithLayout = () => {
    const guildId = useGuildId();
    const { token, get, patch } = useAuth();
    const { addChanges, removeChanges, setIsLoading, reset } = useConfirmation();

    const dispatch = useAppDispatch();
    const settings = useAppSelector(state => selectGuildModSettings(state, guildId));

    const tempSettings = useRef(settings);
    const prevSettings = useRef(settings);
    
    useEffect(() => {
        if(!token || settings || !guildId) return;

        get<ReduxModSettings['settings']>(`/guilds/${guildId}/mod-settings`, 'backend')
            .then(settings => {
                dispatch(setModSettings(guildId, settings));
                tempSettings.current = structuredClone(settings);
                prevSettings.current = structuredClone(settings);
            })
    }, [token, get, guildId, settings]);

    const sendUpdateRequest = () => {
        if(!tempSettings.current || !prevSettings.current) return;

        setIsLoading(true);
        const properties = getPropertiesToUpdate(tempSettings.current, prevSettings.current);
        patch<ReduxModSettings['settings']>(`/guilds/${guildId}/mod-settings`, properties)
            .then(settings => {
                prevSettings.current = structuredClone(settings);
                tempSettings.current = structuredClone(settings);
            })
            .catch(() => {

            })
            .finally(reset);
    }
    const revertChanges = () => {
        if(!tempSettings.current || !prevSettings.current) return;

        const properties = getPropertiesToUpdate(tempSettings.current, prevSettings.current);
        Object.keys(properties).forEach(key => {
            if(!prevSettings.current) return;

            const property = key as keyof typeof prevSettings.current;
            dispatch(updateModSetting(guildId, property, prevSettings.current[property]));
        })
    }

    const updateSetting = useCallback((id: string, value: any) => {
        if(!tempSettings.current || !prevSettings.current) return;

        const property = id as keyof typeof prevSettings.current;
        tempSettings.current[property] = value;
        dispatch(updateModSetting(guildId, property, value));

        const propertiesToUpdate = getPropertiesToUpdate(tempSettings.current, prevSettings.current);
        if(!Object.keys(propertiesToUpdate).length) {
            removeChanges('mod-settings');
        } else {
            addChanges({
                id: 'mod-settings',
                onCancel: revertChanges,
                onConfirm: sendUpdateRequest
            })
        }
    }, [guildId]);

    return(
        <ModuleSection
            header={'Moderation settings'}
            description={'Here you can update settings to change the display and behavior of our moderation commands and logging. These settings apply to all moderation actions and logs.'}
        >
            <div>
                <ModuleSubheader>
                    Command usage
                </ModuleSubheader>
                <div className={styles['section']}>
                    <SettingsItem 
                        id={'ephemeral'}
                        title={'Ephemeral'}
                        description={'Turn moderation commands ephemeral so only the command author can see the response given from the bot.'}
                        checked={settings?.ephemeral}
                        onChange={updateSetting}
                    />
                    <SettingsItem 
                        id={'confirmation'}
                        title={'Confirmation'}
                        description={'Include a message confirmation when running moderation commands.'}
                        checked={settings?.confirmation}
                        onChange={updateSetting}
                    />
                </div>
                <ModuleSubheader>
                    Notify user by DMs
                </ModuleSubheader>
                <div className={styles['section']}>
                    <SettingsItem 
                        id={'sendDMs'}
                        title={'Send DMs'}
                        description={'Send a DM to the user being punished informing them of their punishment.'}
                        checked={settings?.sendDMs}
                        onChange={updateSetting}
                    />
                    <SettingsItem 
                        id={'incName'}
                        title={'Include Name'}
                        description={'Include the name of the staff member when sending a DM to the user being punished.'}
                        checked={settings?.incName}
                        onChange={updateSetting}
                    />
                    <SettingsItem 
                        id={'incReason'}
                        title={'Include Reason'}
                        description={'Include the reason of the punishment when sending a DM to the user being punished.'}
                        checked={settings?.incReason}
                        onChange={updateSetting}
                    />
                </div>
            </div>
        </ModuleSection>
    )
}

ModSettings.getLayout = page => (
    <DashAuthLayout>
        <DashboardLayout>
            <ModerationLayout>
                {page}
            </ModerationLayout>
        </DashboardLayout>
    </DashAuthLayout>
)