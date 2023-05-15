import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

const selectId = (_:RootState, id: string) => id;

export const selectGuilds = (state: RootState) => state.dashboard.guilds;
export const selectAutomods = (state: RootState) => state.dashboard.automod;

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