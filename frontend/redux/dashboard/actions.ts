import { AutoMod, Guild } from "@/types";
import { ADD_AUTOMOD, SET_GUILDS } from "./constants";

export const setGuilds = (guilds: Guild[]) => ({
    type: SET_GUILDS,
    payload: guilds
})
export const addAutomod = (automod: AutoMod) => ({
    type: ADD_AUTOMOD,
    payload: automod
})