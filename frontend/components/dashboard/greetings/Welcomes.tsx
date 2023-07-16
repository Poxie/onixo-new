import styles from './Greetings.module.scss';
import { Input } from "@/components/input"
import { ItemList } from "../item-list"
import { ModuleSection } from "../module-section"
import { ModuleSubheader } from "../module-subheader"
import { MessagePreview } from "../message-preview"
import { ReduxWelcomeSettings } from "@/types"
import { useGuildId } from "@/hooks/useGuildId"
import { useAppSelector } from "@/redux/store"
import { RoleList } from '../role-list';
import { useHasChanges } from '@/hooks/useHasChanges';
import { useAuth } from '@/contexts/auth';
import { selectChannelById, selectWelcomeSettings, setWelcomeSettings, updateWelcomeSetting } from '@/redux/slices/dashboard';

export const Welcomes = () => {
    const guildId = useGuildId();
    const { user } = useAuth();

    const welcome = useAppSelector(state => selectWelcomeSettings(state, guildId))
    const channel = useAppSelector(state => selectChannelById(state, guildId, welcome?.channel as string));
    
    const { updateProperty } = useHasChanges<ReduxWelcomeSettings['settings']>({
        guildId,
        id: 'welcome',
        endpoint: `/guilds/${guildId}/welcome`,
        dispatchAction: setWelcomeSettings,
        updateAction: updateWelcomeSetting,
        selector: selectWelcomeSettings,
    });

    return(
        <ModuleSection
            header={'Welcomes'}
            description={'Greet your new members your way.'}
            className={styles['section']}
            enabled={welcome?.isEnabled}
            onEnableToggle={state => updateProperty('isEnabled', state)}
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
                        defaultActive={welcome?.channel}
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
                        defaultValue={welcome?.message}
                        textArea
                    />
                </div>
                <MessagePreview 
                    message={welcome?.message}
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
                        defaultValue={welcome?.dm}
                        textArea
                    />
                </div>
                <MessagePreview 
                    message={welcome?.dm}
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
                        active={welcome?.users || []}
                        onChange={ids => updateProperty('users', ids)}
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
                        active={welcome?.bots || []}
                        onChange={ids => updateProperty('bots', ids)}
                        loading={welcome === undefined}
                    />
                </div>
            </div>
        </ModuleSection>
    )
}