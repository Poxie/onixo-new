import { AnyAction } from "redux";
import { DashboardState } from "./types";
import { createReducer, updateObject } from "../utils";
import { ADD_AUTOMOD, SET_GUILDS } from "./constants";

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

export const dashboardReducer = createReducer({
    guilds: null,
    automod: []
}, {
    [SET_GUILDS]: setGuilds,
    [ADD_AUTOMOD]: addAutomod,
})