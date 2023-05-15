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