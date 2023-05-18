import { AnyAction } from "redux";
import { DashboardState } from "./types";
import { createReducer, updateItemInArray, updateObject } from "../utils";
import { ADD_ACTION_LOGS, ADD_AUTOMOD, SET_GUILDS, SET_GUILD_CHANNELS, SET_MOD_SETTINGS, UPDATE_ACTION_LOG, UPDATE_ANTILINK, UPDATE_MOD_SETTING } from "./constants";
import { ReduxActionLogs, ReduxModSettings } from "@/types";

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

const addActionLogs: ReducerAction = (state, action) => {
    const { guildId, logChannels } = action.payload;

    return updateObject(state, {
        actionLogs: (
            state.actionLogs
                .filter(item => item.guildId !== guildId)
                .concat({ guildId, logChannels })
        )
    })
}

const updateActionLog: ReducerAction = (state, action) => {
    const { guildId, action: _action, channelId }: {
        guildId: string;
        action: string;
        channelId: ReduxActionLogs['logChannels']['all_logs_channel'];
    } = action.payload;

    const key = _action === 'all' ? `all_logs_channel` : `${_action}_log_channel`;
    const newLogs = state.actionLogs.map(log => {
        if(log.guildId !== guildId) return log;
        
        const newLog = updateObject(log, {
            logChannels: updateObject(log.logChannels, {
                [key]: channelId
            })
        })
        return newLog
    })

    return updateObject(state, {
        actionLogs: newLogs
    })
}

const setModSettings: ReducerAction = (state, action) => {
    const { guildId, settings }: ReduxModSettings = action.payload;

    return updateObject(state, {
        modSettings: (
            state.modSettings
                .filter(setting => setting.guildId !== guildId)
                .concat({ guildId, settings })
        )
    })
}

const updateModSetting: ReducerAction = (state, action) => {
    const { guildId, setting, value }: {
        guildId: string;
        setting: keyof ReduxModSettings['settings'];
        value: boolean;
    } = action.payload;

    return updateObject(state, {
        modSettings: (
            state.modSettings.map(modSetting => {
                if(modSetting.guildId !== guildId) return modSetting;

                return updateObject(modSetting, {
                    settings: updateObject(modSetting.settings, {
                        [setting]: value
                    })
                })
            })
        )
    })
}

export const dashboardReducer = createReducer({
    guilds: null,
    automod: [],
    channels: [],
    actionLogs: [],
    modSettings: [],
}, {
    [SET_GUILDS]: setGuilds,
    [ADD_AUTOMOD]: addAutomod,
    [UPDATE_ANTILINK]: updateAntilink,
    [SET_GUILD_CHANNELS]: setGuildChannels,
    [ADD_ACTION_LOGS]: addActionLogs,
    [UPDATE_ACTION_LOG]: updateActionLog,
    [SET_MOD_SETTINGS]: setModSettings,
    [UPDATE_MOD_SETTING]: updateModSetting,
})