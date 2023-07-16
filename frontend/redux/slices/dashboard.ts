import { Activity, Channel, Guild, Infraction, ReduxActivity, ReduxAntiLink, ReduxChannel, ReduxGoodbyeSettings, ReduxInfractions, ReduxLogs, ReduxModSettings, ReduxRole, ReduxWelcomeSettings, Role } from "@/types";
import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store";

export type DashboardState = {
    guilds: Guild[] | null;
    channels: ReduxChannel[];
    roles: ReduxRole[];
    antiLink: ReduxAntiLink[];
    actionLogs: ReduxLogs[];
    modSettings: ReduxModSettings[];
    welcome: ReduxWelcomeSettings[];
    goodbye: ReduxGoodbyeSettings[];
    infractions: ReduxInfractions[];
    activity: ReduxActivity[];
}

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
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
    } as DashboardState,
    reducers: {
        setGuilds(state, action: PayloadAction<Guild[]>) {
            state.guilds = action.payload;
        },
        updateGuild(state, action: PayloadAction<{
            guildId: string;
            property: keyof Guild;
            value: any;
        }>) {
            const { guildId, property, value } = action.payload;

            const guild = state.guilds?.find(guild => guild.id === guildId);
            if(!guild) return;

            guild[property] = value as never;
        },
        setGuildChannels(state, action: PayloadAction<{
            guildId: string;
            channels: Channel[];
        }>) {
            const { guildId, channels } = action.payload;

            state.channels = state.channels.filter(c => c.guildId !== guildId);
            state.channels.push({
                guildId,
                items: channels
            })
        },
        setGuildRoles(state, action: PayloadAction<{
            guildId: string;
            roles: Role[];
        }>) {
            const { guildId, roles } = action.payload;

            state.roles = state.roles.filter(c => c.guildId !== guildId);
            state.roles.push({
                guildId,
                items: roles
            })
        },
        setAntiLink(state, action: PayloadAction<{
            guildId: string;
            settings: ReduxAntiLink['antiLink'];
        }>) {
            const { guildId, settings } = action.payload;

            state.antiLink = state.antiLink.filter(a => a.guildId !== guildId);
            state.antiLink.push({
                guildId,
                antiLink: settings
            });
        },
        updateAntiLink(state, action: PayloadAction<{
            guildId: string;
            property: keyof ReduxAntiLink['antiLink'];
            value: any;
        }>) {
            const { guildId, property, value } = action.payload;
            
            const antiLink = state.antiLink.find(a => a.guildId === guildId);
            if(!antiLink) return;

            antiLink.antiLink[property] = value;
        },
        setActionLogs(state, action: PayloadAction<{
            guildId: string;
            settings: ReduxLogs['logChannels'];
        }>) {
            const { guildId, settings } = action.payload;

            state.actionLogs = state.actionLogs.filter(a => a.guildId !== guildId);
            state.actionLogs.push({
                guildId,
                logChannels: settings
            });
        },
        updateActionLog(state, action: PayloadAction<{
            guildId: string;
            property: keyof ReduxLogs['logChannels'];
            value: any;
        }>) {
            const { guildId, property, value } = action.payload;
            
            const actionLogs = state.actionLogs.find(a => a.guildId === guildId);
            if(!actionLogs) return;

            actionLogs.logChannels[property] = value;
        },
        setModSettings(state, action: PayloadAction<{
            guildId: string;
            settings: ReduxModSettings['settings'];
        }>) {
            const { guildId, settings } = action.payload;

            state.modSettings = state.modSettings.filter(a => a.guildId !== guildId);
            state.modSettings.push({ guildId, settings })
        },
        updateModSetting(state, action: PayloadAction<{
            guildId: string;
            property: keyof ReduxModSettings['settings'];
            value: any;
        }>) {
            const { guildId, property, value } = action.payload;
            
            const modSettings = state.modSettings.find(a => a.guildId === guildId);
            if(!modSettings) return;

            modSettings.settings[property] = value;
        },
        setWelcomeSettings(state, action: PayloadAction<{
            guildId: string;
            settings: ReduxWelcomeSettings['settings'];
        }>) {
            const { guildId, settings } = action.payload;

            state.welcome = state.welcome.filter(a => a.guildId !== guildId);
            state.welcome.push({ guildId, settings })
        },
        updateWelcomeSetting(state, action: PayloadAction<{
            guildId: string;
            property: keyof ReduxWelcomeSettings['settings'];
            value: any;
        }>) {
            const { guildId, property, value } = action.payload;
            
            const welcome = state.welcome.find(a => a.guildId === guildId);
            if(!welcome) return;

            welcome.settings[property] = value as never;
        },
        setGoodbyeSettings(state, action: PayloadAction<{
            guildId: string;
            settings: ReduxGoodbyeSettings['settings'];
        }>) {
            const { guildId, settings } = action.payload;

            state.goodbye = state.goodbye.filter(a => a.guildId !== guildId);
            state.goodbye.push({ guildId, settings })
        },
        updateGoodbyeSetting(state, action: PayloadAction<{
            guildId: string;
            property: keyof ReduxGoodbyeSettings['settings'];
            value: any;
        }>) {
            const { guildId, property, value } = action.payload;
            
            const goodbye = state.goodbye.find(a => a.guildId === guildId);
            if(!goodbye) return;

            goodbye.settings[property] = value as never;
        },
        setInfractions(state, action: PayloadAction<{
            guildId: string;
            infractions: ReduxInfractions['infractions'];
        }>) {
            const { guildId, infractions } = action.payload;

            state.infractions = state.infractions.filter(a => a.guildId !== guildId);
            state.infractions.push({ guildId, infractions })
        },
        updateInfraction(state, action: PayloadAction<{
            guildId: string;
            infraction: Infraction;
        }>) {
            const { guildId, infraction } = action.payload;
            
            const infractions = state.infractions.find(a => a.guildId === guildId);
            if(!infractions) return;

            infractions.infractions = infractions.infractions.map(inf => {
                if(inf.case_id !== infraction.case_id) return inf;
                return infraction;
            });
        },
        addActivity(state, action: PayloadAction<{
            guildId: string;
            activity: Activity[];
        }>) {
            const { guildId, activity } = action.payload;
            
            if(!state.activity.find(act => act.guildId === guildId)) {
                state.activity.push({ guildId, activity });
            }

            const act = state.activity.find(act => act.guildId === guildId);

            // Preventing react strict mode from pushing this twice in development
            if(act?.activity.find(a => a._id === activity[0]._id)) return;

            act?.activity.push(...activity);
        },
        prependActivity(state, action: PayloadAction<{
            guildId: string;
            activity: Activity;
        }>) {
            const { guildId, activity } = action.payload;

            const act = state.activity.find(act => act.guildId === guildId);
            if(!act) return;

            act.activity.unshift(activity);
        }
    }
})

// Actions & reducer
export const { 
    setGuilds, updateGuild, setGuildChannels, setGuildRoles, setAntiLink, 
    updateAntiLink, setActionLogs, updateActionLog, setModSettings, updateModSetting, 
    setWelcomeSettings, updateWelcomeSetting, setGoodbyeSettings, updateGoodbyeSetting,
    setInfractions, updateInfraction, addActivity, prependActivity
} = dashboardSlice.actions;
export default dashboardSlice.reducer;


// Selectors
const selectId = (_:RootState, id: string) => id;
const _selectId = (_:RootState, __:any, id: string) => id;

export const selectGuilds = (state: RootState) => state.dashboard.guilds;
export const selectAutomods = (state: RootState) => state.dashboard.antiLink;
export const selectChannels = (state: RootState) => state.dashboard.channels;
export const selectRoles = (state: RootState) => state.dashboard.roles;
export const selectAllActionLogs = (state: RootState) => state.dashboard.actionLogs;
export const selectModSettings = (state: RootState) => state.dashboard.modSettings;

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
    (automods, guildId) => automods.find(automod => automod.guildId === guildId) !== undefined
)
export const selectAntilinkById = createSelector(
    [selectAutomods, selectId],
    (automods, guildId) => automods.find(automod => automod.guildId === guildId)?.antiLink
)

export const selectGuildChannels = createSelector(
    [selectChannels, selectId],
    (channels, guildId) => channels.find(item => item.guildId === guildId)?.items
)
export const selectChannelsFetched = createSelector(
    [selectGuildChannels],
    channels => channels !== undefined
)
export const selectGuildChannelIds = createSelector(
    [selectGuildChannels],
    channels => channels?.map(channel => channel.id)
)
export const selectChannelById = createSelector(
    [selectGuildChannels, _selectId],
    (channels, channelId) => channels?.find(channel => channel.id === channelId)
)

export const selectGuildRoles = createSelector(
    [selectRoles, selectId],
    (roles, guildId) => roles.find(item => item.guildId === guildId)?.items
)
export const selectRolesFetched = createSelector(
    [selectGuildRoles],
    roles => roles !== undefined
)
export const selectGuildRoleIds = createSelector(
    [selectGuildRoles],
    roles => roles?.map(role => role.id)
)
export const selectRoleById = createSelector(
    [selectGuildRoles, _selectId],
    (roles, roleId) => roles?.find(role => role.id === roleId)
)

export const selectLogs = createSelector(
    [selectAllActionLogs, selectId],
    (actionLogs, guildId) => actionLogs.find(log => log.guildId === guildId)?.logChannels
)
export const selectLog = createSelector(
    [selectLogs, _selectId],
    (channels, actionType) => (channels ? (channels as any)[`${actionType}_log${actionType === 'all' ? 's' : ''}_channel`] : undefined) as string | undefined
)

export const selectGuildModSettings = createSelector(
    [selectModSettings, selectId],
    (settings, guildId) => settings.find(setting => setting.guildId === guildId)?.settings
)
export const selectModSettingsFetched = createSelector(
    [selectGuildModSettings],
    settings => settings !== undefined
)

const selectWelcome = (state: RootState) => state.dashboard.welcome;
export const selectWelcomeSettings = createSelector(
    [selectWelcome, selectId],
    (welcomes, guildId) => welcomes.find(welcome => welcome.guildId === guildId)?.settings
)

const selectGoodbye = (state: RootState) => state.dashboard.goodbye;
export const selectGoodbyeSettings = createSelector(
    [selectGoodbye, selectId],
    (goodbyes, guildId) => goodbyes.find(bye => bye.guildId === guildId)?.settings
)

const selectAllInfractions = (state: RootState) => state.dashboard.infractions;
export const selectInfractions = createSelector(
    [selectAllInfractions, selectId],
    (infractions, guildId) => infractions.find(item => item.guildId === guildId)?.infractions
)
export const selectInfractionById = createSelector(
    [selectInfractions, _selectId],
    (infractions, infractionId) => infractions?.find(infraction => infraction._id === infractionId)
)

export const selectAllActivity = (state: RootState) => state.dashboard.activity;
export const selectActivity = createSelector(
    [selectAllActivity, selectId],
    (activity, guildId) => activity.find(act => act.guildId === guildId)?.activity
)