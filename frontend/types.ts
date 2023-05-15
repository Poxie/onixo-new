export type User = {
    id: string;
    username: string;
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

export type AutoMod = {
    guild_id: string;
    antilink: {
        discord: boolean;
        youtube: boolean;
        twitch: boolean;
        instagram: boolean;
        twitter: boolean;
        facebook: boolean;
        custom: string[]
    }
}
export type ReduxRole = {
    guildId: string;
    items: Role[];
}
export type ReduxChannel = {
    guildId: string;
    items: Channel[];
}
export type ReduxActionLogs = {
    guildId: string;
    logChannels: {
        all_logs_channel?: string[];
        ban_log_channel?: string[];
        kick_log_channel?: string[];
        mute_log_channel?: string[];
        warn_log_channel?: string[];
    }
}