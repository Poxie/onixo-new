import { AnyAction } from "redux";
import { DashboardState } from "./types";
import { createReducer, updateObject } from "../utils";
import { SET_GUILDS } from "./constants";

// Reducer actions
type ReducerAction = (state: DashboardState, action: AnyAction) => DashboardState;

const setGuilds: ReducerAction = (state, action) => {
    return updateObject(state, {
        guilds: action.payload
    })
}

export const dashboardReducer = createReducer({
    guilds: null
}, {
    [SET_GUILDS]: setGuilds
})