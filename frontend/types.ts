export type User = {
    id: string;
    username: string;
    global_name: string;
    discriminator: string;
    avatar: string;
    banner: string;
}
export type Guild = {
    id: string;
    name: string;
    icon: string;
    owner_id: string;
    splash?: string;
    invited: boolean;
}
export type Role = {
    id: string;
    name: string;
    color: number;
    hois: boolean;
    position: number;
    permissions: string;
    mentionable: boolean;
    managed: boolean;
}
export type Channel = {
    id: string;
    type: number;
    name: string;
    nsfw: boolean;
    topic?: string;
    last_message_id?: string;
}
export type Embed = {
    color: string;
    thumbnail: string;
    image: string;
    url: string;
    title: string;
    description: string;
    author: {
        text: string;
        icon: string;
    }
    footer: {
        text: string;
        icon: string;
    }
    fields: {
        name: string;
        value: string;
        inline: boolean;
    }[];
}
export type Infraction = {
    _id: string;
    guild_id: number;
    case_id: number;
    duration: null | number;
    date: number;
    reason: string | null;
    issuer: User;
    target: User;
    action: 'ban' | 'kick' | 'mute' | 'warn';
}
export type ActivityChange = {
    new_value: null | string | number | boolean | Channel | Role | undefined;
    previous_value: null | string | number | boolean | Channel | Role | undefined;
    property: string;
}
export type Activity = {
    guild_id: string;
    timestamp: number;
    action_id: 'welcome' | 'goodbye' | 'logging' | 'moderation' | 'anti-link' | 'action-logs' | 'event-logs';
    changes: ActivityChange[];
    user_id: string;
    user: User;
}

export type ReduxChannel = {
    guildId: string;
    items: Channel[];
}
export type ReduxRole = {
    guildId: string;
    items: Role[];
}
export type ReduxLogs = {
    guildId: string;
    logChannels: {
        all_logs_channel?: string | null;
        ban_log_channel?: string | null;
        kick_log_channel?: string | null;
        mute_log_channel?: string | null;
        warn_log_channel?: string | null;
        message_log_channel?: string | null;
        channel_log_channel?: string | null;
        user_log_channel?: string | null;
        server_log_channel?: string | null;
        voice_log_channel?: string | null;
    }
}
export type ReduxModSettings = {
    guildId: string;
    settings: {
        confirmation: boolean;
        ephemeral: boolean;
        incName: boolean;
        incReason: boolean;
        sendDMs: boolean;
    }
}
export type ReduxWelcomeSettings = {
    guildId: string;
    settings: {
        isEnabled: boolean;
        dm: string;
        message: string;
        channel: string;
        users: string[];
        bots: string[] 
    }
}
export type ReduxGoodbyeSettings = {
    guildId: string;
    settings: {
        isEnabled: boolean;
        message: string;
        channel: string;
    }
}
export type ReduxInfractions = {
    guildId: string;
    infractions: Infraction[];
}
export type ReduxAntiLink = {
    guildId: string;
    antiLink: {
        discord: boolean;
        youtube: boolean;
        twitch: boolean;
        instagram: boolean;
        twitter: boolean;
        facebook: boolean;
        custom: string[]
    }
}
export type ReduxActivity = {
    guildId: string;
    activity: Activity[];
}

export type HostedPage = {
    created_at: number;
    id: string;
    state: string;
    url: string;
}