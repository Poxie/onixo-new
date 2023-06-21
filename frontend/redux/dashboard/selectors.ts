import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

const selectId = (_:RootState, id: string) => id;
const _selectId = (_:RootState, __:any, id: string) => id;

export const selectGuilds = (state: RootState) => state.dashboard.guilds;
export const selectAutomods = (state: RootState) => state.dashboard.automod;
export const selectChannels = (state: RootState) => state.dashboard.channels;
export const selectActionLogs = (state: RootState) => state.dashboard.actionLogs;
export const selectModSettings = (state: RootState) => state.dashboard.modSettings;

export const selectGuildIds = createSelector(
    [selectGuilds],
    guilds => guilds?.map(guild => guild.id)
)
export const selectGuildById = createSelector(
    [selectGuilds, selectId],
    (guilds, guildId) => guilds?.find(guild => guild.id === guildId)
)

export const selectAutomodFetched = createSelector(
    [selectAutomods, selectId],
    (automods, guildId) => automods.find(automod => automod.guild_id === guildId) !== undefined
)
export const selectAntilinkById = createSelector(
    [selectAutomods, selectId],
    (automods, guildId) => automods.find(automod => automod.guild_id === guildId)?.antilink
)

export const selectGuildChannels = createSelector(
    [selectChannels, selectId],
    (channels, guildId) => channels.find(item => item.guildId === guildId)?.items
)
export const selectChannelsFetched = createSelector(
    [selectGuildChannels],
    channels => channels !== undefined
)
export const selectGuildChannelIds = createSelector(
    [selectGuildChannels],
    channels => channels?.map(channel => channel.id)
)
export const selectChannelById = createSelector(
    [selectGuildChannels, _selectId],
    (channels, channelId) => channels?.find(channel => channel.id === channelId)
)

export const selectGuildActionLogs = createSelector(
    [selectActionLogs, selectId],
    (actionLogs, guildId) => (
        actionLogs.find(item => item.guildId === guildId)?.logChannels
    )
)
export const selectGuildActionLog = createSelector(
    [selectGuildActionLogs, _selectId],
    (channels, actionType) => (channels ? (channels as any)[`${actionType}_log${actionType === 'all' ? 's' : ''}_channel`] : undefined) as string | undefined
)

export const selectGuildModSettings = createSelector(
    [selectModSettings, selectId],
    (settings, guildId) => settings.find(setting => setting.guildId === guildId)?.settings
)
export const selectModSettingsFetched = createSelector(
    [selectGuildModSettings],
    settings => settings !== undefined
)

const selectWelcome = (state: RootState) => state.dashboard.welcome;
export const selectWelcomeSettings = createSelector(
    [selectWelcome, selectId],
    (welcomes, guildId) => welcomes.find(welcome => welcome.guildId === guildId)
)