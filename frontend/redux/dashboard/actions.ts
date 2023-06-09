import { AutoMod, Channel, Guild, ReduxActionLogs, ReduxModSettings } from "@/types";
import { ADD_ACTION_LOGS, ADD_AUTOMOD, SET_GUILDS, SET_GUILD_CHANNELS, SET_MOD_SETTINGS, UPDATE_ACTION_LOG, UPDATE_ANTILINK, UPDATE_MOD_SETTING } from "./constants";

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
export const updateActionLog = (guildId: string, action: string, channelId: ReduxActionLogs['logChannels']['all_logs_channel']) => ({
    type: UPDATE_ACTION_LOG,
    payload: { guildId, action, channelId }
})
export const setModSettings = (guildId: string, settings: ReduxModSettings['settings']) => ({
    type: SET_MOD_SETTINGS,
    payload: { guildId, settings }
})
export const updateModSetting = (guildId: string, setting: keyof ReduxModSettings['settings'], value: boolean) => ({
    type: UPDATE_MOD_SETTING,
    payload: { guildId, setting, value }
})