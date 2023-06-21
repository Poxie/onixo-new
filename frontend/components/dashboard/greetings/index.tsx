import styles from './Greetings.module.scss';
import { DashAuthLayout } from "@/layouts/dash-auth"
import { DashboardLayout } from "@/layouts/dashboard"
import { NextPageWithLayout } from "@/pages/_app"
import { ModuleHeader } from "../module-header"
import { ModuleSection } from "../module-section"
import { ItemList } from '../item-list';
import { ModuleSubheader } from '../module-subheader';
import { Input } from '@/components/input';
import { useState } from 'react';
import { useAppSelector } from '@/redux/store';
import { selectChannelById, selectGuildById } from '@/redux/dashboard/selectors';
import { useGuildId } from '@/hooks/useGuildId';
import Image from 'next/image';
import { getCurrentTime } from '@/utils';
import { replaceVariables } from '@/utils/variables';
import { useAuth } from '@/contexts/auth';
import { MessagePreview } from '../message-preview';

export const Greetings: NextPageWithLayout = () => {
    const guildId = useGuildId();
    const { user } = useAuth();

    const [channelId, setChannelId] = useState<null | string>(null);
    const [message, setMessage] = useState('');
    const [directMessage, setDirectMessage] = useState('');

    const channel = useAppSelector(state => selectChannelById(state, guildId, channelId as string));
    const guild = useAppSelector(state => selectGuildById(state, guildId));

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
                    <ItemList onChange={setChannelId} />
                    <ModuleSubheader
                        extraHeader={'Enter a message below to greet new members.'}
                        className={styles['header']}
                    >
                        Welcome message
                    </ModuleSubheader>
                    <Input 
                        placeholder={'Welcome message'}
                        onChange={setMessage}
                        textArea
                    />
                </div>
                <MessagePreview 
                    message={message}
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
                        onChange={setDirectMessage}
                        textArea
                    />
                </div>
                <MessagePreview 
                    message={directMessage}
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