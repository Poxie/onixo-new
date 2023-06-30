import { Channel, Guild, Infraction, ReduxLogs, ReduxAntiLink, ReduxGoodbyeSettings, ReduxModSettings, ReduxWelcomeSettings, Role, Activity } from "@/types";
import { SET_LOGS, SET_ANTI_LINK, SET_GOODBYE_SETTINGS, SET_GUILDS, SET_GUILD_CHANNELS, SET_GUILD_ROLES, SET_INFRACTIONS, SET_MOD_SETTINGS, SET_WELCOME_SETTINGS, UPDATE_LOG, UPDATE_ANTILINK, UPDATE_GOODBYE_SETTING, UPDATE_INFRACTION, UPDATE_MOD_SETTING, UPDATE_WELCOME_SETTING, ADD_ACTIVITY, PREPEND_ACTIVITY } from "./constants";

export const setGuilds = (guilds: Guild[]) => ({
    type: SET_GUILDS,
    payload: guilds
})
export const setAntiLink = (guildId: string, antiLink: ReduxAntiLink['antiLink']) => ({
    type: SET_ANTI_LINK,
    payload: { guildId, antiLink }
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
export const setActionLogs = (guildId: string, logChannels: ReduxLogs['logChannels']) => ({
    type: SET_LOGS,
    payload: { guildId, logChannels }
})
export const updateActionLog = (guildId: string, action: keyof ReduxLogs['logChannels'], channelId: ReduxLogs['logChannels']['all_logs_channel']) => ({
    type: UPDATE_LOG,
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
export const addActivity = (guildId: string, activity: Activity[]) => ({
    type: ADD_ACTIVITY,
    payload: { guildId, activity }
})
export const prependActivity = (guildId: string, activity: Activity) => ({
    type: PREPEND_ACTIVITY,
    payload: { guildId, activity }
})