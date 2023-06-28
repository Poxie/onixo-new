import { Guild, ReduxLogs, ReduxAntiLink, ReduxChannel, ReduxGoodbyeSettings, ReduxInfractions, ReduxModSettings, ReduxRole, ReduxWelcomeSettings, ReduxActivity } from "@/types"

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
    activity: ReduxActivity['activity'];
}