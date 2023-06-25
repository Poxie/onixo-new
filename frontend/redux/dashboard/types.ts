import { Guild, ReduxActionLogs, ReduxAntiLink, ReduxChannel, ReduxGoodbyeSettings, ReduxInfractions, ReduxModSettings, ReduxRole, ReduxWelcomeSettings } from "@/types"

export type DashboardState = {
    guilds: Guild[] | null;
    channels: ReduxChannel[];
    roles: ReduxRole[];
    antiLink: ReduxAntiLink[];
    actionLogs: ReduxActionLogs[];
    modSettings: ReduxModSettings[];
    welcome: ReduxWelcomeSettings[];
    goodbye: ReduxGoodbyeSettings[];
    infractions: ReduxInfractions[];
}