import { AnyAction } from "redux";
import { DashboardState } from "./types";
import { createReducer, updateItemInArray, updateObject } from "../utils";
import { SET_ANTI_LINK, SET_GOODBYE_SETTINGS, SET_GUILDS, SET_GUILD_CHANNELS, SET_GUILD_ROLES, SET_INFRACTIONS, SET_MOD_SETTINGS, SET_WELCOME_SETTINGS, UPDATE_ANTILINK, UPDATE_GOODBYE_SETTING, UPDATE_INFRACTION, UPDATE_MOD_SETTING, UPDATE_WELCOME_SETTING, UPDATE_LOG, SET_LOGS, ADD_ACTIVITY, PREPEND_ACTIVITY } from "./constants";
import { Infraction, ReduxLogs, ReduxAntiLink, ReduxGoodbyeSettings, ReduxModSettings, ReduxWelcomeSettings, ReduxActivity, Activity } from "@/types";

// Reducer actions
type ReducerAction = (state: DashboardState, action: AnyAction) => DashboardState;

const setGuilds: ReducerAction = (state, action) => {
    return updateObject(state, {
        guilds: action.payload
    })
}

const setAntiLink: ReducerAction = (state, action) => {
    const { guildId, antiLink }: ReduxAntiLink = action.payload;

    return updateObject(state, {
        antiLink: state.antiLink.filter(item => item.guildId !== guildId).concat({
            guildId,
            antiLink
        })
    })
}

const updateAntilink: ReducerAction = (state, action) => {
    const { guildId, property, value }: {
        guildId: string;
        property: string;
        value: boolean;
    } = action.payload;

    return updateObject(state, {
        antiLink: state.antiLink.map(antilink => {
            if(antilink.guildId !== guildId) return antilink;

            return updateObject(antilink, {
                antiLink: updateObject(antilink.antiLink, {
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

const setGuildRoles: ReducerAction = (state, action) => {
    const { guildId, roles } = action.payload;

    return updateObject(state, {
        roles: (
            state.roles
                .filter(item => item.guildId !== guildId)
                .concat({ guildId, items: roles })
        )
    })
}

const setLogs: ReducerAction = (state, action) => {
    const { guildId, logChannels } = action.payload;

    return updateObject(state, {
        actionLogs: (
            state.actionLogs
                .filter(item => item.guildId !== guildId)
                .concat({ guildId, logChannels })
        )
    })
}

const updateLog: ReducerAction = (state, action) => {
    const { guildId, action: _action, channelId }: {
        guildId: string;
        action: keyof ReduxLogs['logChannels'];
        channelId: ReduxLogs['logChannels']['all_logs_channel'];
    } = action.payload;

    const newLogs = state.actionLogs.map(log => {
        if(log.guildId !== guildId) return log;
        
        const newLog = updateObject(log, {
            logChannels: updateObject(log.logChannels, {
                [_action]: channelId
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

const setWelcomeSettings: ReducerAction = (state, action) => {
    const { guildId, settings }: {
        guildId: string;
        settings: ReduxWelcomeSettings['settings']
    } = action.payload;

    return updateObject(state, {
        welcome: state.welcome.filter(wel => wel.guildId !== guildId).concat({
            guildId,
            settings
        })
    })
}

const updateWelcomeSetting: ReducerAction = (state, action) => {
    const { guildId, setting, value }: {
        guildId: string;
        setting: keyof ReduxWelcomeSettings['settings'];
        value: any;
    } = action.payload;

    return updateObject(state, {
        welcome: (
            state.welcome.map(welcome => {
                if(welcome.guildId !== guildId) return welcome;

                return updateObject(welcome, {
                    settings: updateObject(welcome.settings, {
                        [setting]: value
                    })
                })
            })
        )
    })
}

const setGoodbyeSettings: ReducerAction = (state, action) => {
    const { guildId, settings }: {
        guildId: string;
        settings: ReduxGoodbyeSettings['settings']
    } = action.payload;

    return updateObject(state, {
        goodbye: state.goodbye.filter(wel => wel.guildId !== guildId).concat({
            guildId,
            settings
        })
    })
}

const updateGoodbyeSetting: ReducerAction = (state, action) => {
    const { guildId, setting, value }: {
        guildId: string;
        setting: keyof ReduxGoodbyeSettings['settings'];
        value: any;
    } = action.payload;

    return updateObject(state, {
        goodbye: (
            state.goodbye.map(goodbye => {
                if(goodbye.guildId !== guildId) return goodbye;

                return updateObject(goodbye, {
                    settings: updateObject(goodbye.settings, {
                        [setting]: value
                    })
                })
            })
        )
    })
}

const setInfractions: ReducerAction = (state, action) => {
    const { guildId, infractions }: {
        guildId: string;
        infractions: Infraction[];
    } = action.payload;

    return updateObject(state, {
        infractions: (
            state.infractions.filter(item => item.guildId !== guildId).concat({
                guildId,
                infractions
            })
        )
    })
}

const updateInfraction: ReducerAction = (state, action) => {
    const { guildId, infraction }: {
        guildId: string;
        infraction: Infraction;
    } = action.payload;

    return updateObject(state, {
        infractions: (
            state.infractions.map(setting => {
                if(setting.guildId !== guildId) return setting;

                return updateObject(setting, {
                    infractions: setting.infractions.map(i => {
                        if(i.case_id !== infraction.case_id) return i;
                        return infraction;
                    })
                })
            })
        )
    })
}

const addActivity: ReducerAction = (state, action) => {
    const { guildId, activity }: ReduxActivity = action.payload;

    return updateObject(state, {
        activity: state.activity.concat(activity)
    })
}

const prependActivity: ReducerAction = (state, action) => {
    const activity: Activity = action.payload;

    // If activity is not fetched, dont prepend
    if(!state.activity.find(act => act.guild_id === activity.guild_id)) return state;

    return updateObject(state, {
        activity: [...[activity], ...state.activity]
    })
}

export const dashboardReducer = createReducer({
    guilds: null,
    antiLink: [],
    channels: [],
    roles: [],
    actionLogs: [],
    modSettings: [],
    welcome: [],
    goodbye: [],
    infractions: [],
    activity: [],
}, {
    [SET_GUILDS]: setGuilds,
    [SET_ANTI_LINK]: setAntiLink,
    [UPDATE_ANTILINK]: updateAntilink,
    [SET_GUILD_CHANNELS]: setGuildChannels,
    [SET_GUILD_ROLES]: setGuildRoles,
    [SET_LOGS]: setLogs,
    [UPDATE_LOG]: updateLog,
    [SET_MOD_SETTINGS]: setModSettings,
    [UPDATE_MOD_SETTING]: updateModSetting,
    [SET_WELCOME_SETTINGS]: setWelcomeSettings,
    [UPDATE_WELCOME_SETTING]: updateWelcomeSetting,
    [SET_GOODBYE_SETTINGS]: setGoodbyeSettings,
    [UPDATE_GOODBYE_SETTING]: updateGoodbyeSetting,
    [SET_INFRACTIONS]: setInfractions,
    [UPDATE_INFRACTION]: updateInfraction,
    [ADD_ACTIVITY]: addActivity,
    [PREPEND_ACTIVITY]: prependActivity,
})