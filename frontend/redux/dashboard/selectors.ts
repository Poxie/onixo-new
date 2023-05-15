import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

const selectId = (_:RootState, id: string) => id;
const _selectId = (_:RootState, __:any, id: string) => id;

export const selectGuilds = (state: RootState) => state.dashboard.guilds;
export const selectAutomods = (state: RootState) => state.dashboard.automod;
export const selectChannels = (state: RootState) => state.dashboard.channels;

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