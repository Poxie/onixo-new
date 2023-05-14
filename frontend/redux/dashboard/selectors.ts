import { RootState } from "../store";

export const selectGuilds = (state: RootState) => state.dashboard.guilds;