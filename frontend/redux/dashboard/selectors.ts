import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

const selectId = (_:RootState, id: string) => id;

export const selectGuilds = (state: RootState) => state.dashboard.guilds;
export const selectGuildIds = createSelector(
    [selectGuilds],
    guilds => guilds?.map(guild => guild.id)
)
export const selectGuildById = createSelector(
    [selectGuilds, selectId],
    (guilds, guildId) => guilds?.find(guild => guild.id === guildId)
)