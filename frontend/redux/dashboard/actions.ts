import { Guild } from "@/types";
import { SET_GUILDS } from "./constants";

export const setGuilds = (guilds: Guild[]) => ({
    type: SET_GUILDS,
    payload: guilds
})