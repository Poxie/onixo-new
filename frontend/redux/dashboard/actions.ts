import { AutoMod, Channel, Guild } from "@/types";
import { ADD_AUTOMOD, SET_GUILDS, SET_GUILD_CHANNELS, UPDATE_ANTILINK } from "./constants";

export const setGuilds = (guilds: Guild[]) => ({
    type: SET_GUILDS,
    payload: guilds
})
export const addAutomod = (automod: AutoMod) => ({
    type: ADD_AUTOMOD,
    payload: automod
})
export const updateAntilink = (guildId: string, property: string, value: boolean) => ({
    type: UPDATE_ANTILINK,
    payload: { guildId, property, value }
})
export const setGuildChannels = (guildId: string, channels: Channel[]) => ({
    type: SET_GUILD_CHANNELS,
    payload: { guildId, channels }
})