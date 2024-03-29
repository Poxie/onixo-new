import { ModuleSection } from '../../module-section';
import { ModuleSubheader } from '../../module-subheader';
import styles from './ModSettings.module.scss';
import { SettingsItem } from './SettingsItem';
import { useGuildId } from '@/hooks/useGuildId';
import { selectGuildModSettings, selectModSettingsFetched } from '@/redux/dashboard/selectors';
import { ReduxModSettings } from '@/types';
import { setModSettings, updateModSetting } from '@/redux/dashboard/actions';
import { DashAuthLayout } from '@/layouts/dash-auth';
import { DashboardLayout } from '@/layouts/dashboard';
import { ModerationLayout } from '@/layouts/moderation';
import { NextPageWithLayout } from '@/pages/_app';
import { useHasChanges } from '@/hooks/useHasChanges';
import { useAppSelector } from '@/redux/store';

export const ModSettings: NextPageWithLayout = () => {
    const guildId = useGuildId();

    const settings = useAppSelector(state => selectGuildModSettings(state, guildId));

    const { updateProperty } = useHasChanges<ReduxModSettings['settings']>({
        guildId,
        id: 'mod-settings',
        dispatchAction: setModSettings,
        updateAction: updateModSetting,
        selector: selectGuildModSettings,
        endpoint: `/guilds/${guildId}/mod-settings`,
    })

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
                        onChange={updateProperty}
                    />
                    <SettingsItem 
                        id={'confirmation'}
                        title={'Confirmation'}
                        description={'Include a message confirmation when running moderation commands.'}
                        checked={settings?.confirmation}
                        onChange={updateProperty}
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
                        onChange={updateProperty}
                    />
                    <SettingsItem 
                        id={'incName'}
                        title={'Include Name'}
                        description={'Include the name of the staff member when sending a DM to the user being punished.'}
                        checked={settings?.incName}
                        onChange={updateProperty}
                    />
                    <SettingsItem 
                        id={'incReason'}
                        title={'Include Reason'}
                        description={'Include the reason of the punishment when sending a DM to the user being punished.'}
                        checked={settings?.incReason}
                        onChange={updateProperty}
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