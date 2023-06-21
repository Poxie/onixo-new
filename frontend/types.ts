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
        all_logs_channel?: string | null;
        ban_log_channel?: string | null;
        kick_log_channel?: string | null;
        mute_log_channel?: string | null;
        warn_log_channel?: string | null;
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