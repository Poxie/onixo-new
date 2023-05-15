import { AutoMod, Channel, Guild, ReduxActionLogs } from "@/types";
import { ADD_ACTION_LOGS, ADD_AUTOMOD, SET_GUILDS, SET_GUILD_CHANNELS, UPDATE_ANTILINK } from "./constants";

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
export const addActionLogs = (guildId: string, logChannels: ReduxActionLogs['logChannels']) => ({
    type: ADD_ACTION_LOGS,
    payload: { guildId, logChannels }
})