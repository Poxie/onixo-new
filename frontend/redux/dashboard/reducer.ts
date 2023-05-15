import { AnyAction } from "redux";
import { DashboardState } from "./types";
import { createReducer, updateItemInArray, updateObject } from "../utils";
import { ADD_AUTOMOD, SET_GUILDS, SET_GUILD_CHANNELS, UPDATE_ANTILINK } from "./constants";
import { Channel } from "diagnostics_channel";

// Reducer actions
type ReducerAction = (state: DashboardState, action: AnyAction) => DashboardState;

const setGuilds: ReducerAction = (state, action) => {
    return updateObject(state, {
        guilds: action.payload
    })
}

const addAutomod: ReducerAction = (state, action) => {
    return updateObject(state, {
        automod: state.automod.concat(action.payload)
    })
}

const updateAntilink: ReducerAction = (state, action) => {
    const { guildId, property, value } = action.payload as {
        guildId: string;
        property: string;
        value: boolean;
    }

    return updateObject(state, {
        automod: state.automod.map(automod => {
            if(automod.guild_id !== guildId) return automod;

            return updateObject(automod, {
                antilink: updateObject(automod.antilink, {
                    [property]: value
                })
            })
        })
    })
}

const setGuildChannels: ReducerAction = (state, action) => {
    const { guildId, channels } = action.payload;

    return updateObject(state, {
        channels: (
            state.channels
                .filter(item => item.guildId !== guildId)
                .concat({ guildId, items: channels })
        )
    })
}

export const dashboardReducer = createReducer({
    guilds: null,
    automod: [],
    channels: [] 
}, {
    [SET_GUILDS]: setGuilds,
    [ADD_AUTOMOD]: addAutomod,
    [UPDATE_ANTILINK]: updateAntilink,
    [SET_GUILD_CHANNELS]: setGuildChannels
})