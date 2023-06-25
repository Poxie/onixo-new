import { AutoMod, Channel, Guild, Infraction, ReduxActionLogs, ReduxGoodbyeSettings, ReduxModSettings, ReduxWelcomeSettings, Role } from "@/types";
import { ADD_ACTION_LOGS, ADD_AUTOMOD, SET_GOODBYE_SETTINGS, SET_GUILDS, SET_GUILD_CHANNELS, SET_GUILD_ROLES, SET_INFRACTIONS, SET_MOD_SETTINGS, SET_WELCOME_SETTINGS, UPDATE_ACTION_LOG, UPDATE_ANTILINK, UPDATE_GOODBYE_SETTING, UPDATE_INFRACTION, UPDATE_MOD_SETTING, UPDATE_WELCOME_SETTING } from "./constants";

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
export const setGuildRoles = (guildId: string, roles: Role[]) => ({
    type: SET_GUILD_ROLES,
    payload: { guildId, roles }
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
export const setWelcomeSettings = (guildId: string, settings: ReduxWelcomeSettings['settings']) => ({
    type: SET_WELCOME_SETTINGS,
    payload: { guildId, settings }
})
export const updateWelcomeSetting = (guildId: string, setting: keyof ReduxWelcomeSettings['settings'], value: any) => ({
    type: UPDATE_WELCOME_SETTING,
    payload: { guildId, setting, value }
})
export const setGoodbyeSettings = (guildId: string, settings: ReduxGoodbyeSettings['settings']) => ({
    type: SET_GOODBYE_SETTINGS,
    payload: { guildId, settings }
})
export const updateGoodbyeSetting = (guildId: string, setting: keyof ReduxGoodbyeSettings['settings'], value: any) => ({
    type: UPDATE_GOODBYE_SETTING,
    payload: { guildId, setting, value }
})
export const setInfractions = (guildId: string, infractions: Infraction[]) => ({
    type: SET_INFRACTIONS,
    payload: { guildId, infractions }
})
export const updateInfraction = (guildId: string, infraction: Infraction) => ({
    type: UPDATE_INFRACTION,
    payload: { guildId, infraction }
})