import { AutoMod, Guild, ReduxActionLogs, ReduxChannel, ReduxGoodbyeSettings, ReduxModSettings, ReduxRole, ReduxWelcomeSettings } from "@/types"

export type DashboardState = {
    guilds: Guild[] | null;
    automod: AutoMod[];
    channels: ReduxChannel[];
    roles: ReduxRole[];
    actionLogs: ReduxActionLogs[];
    modSettings: ReduxModSettings[];
    welcome: ReduxWelcomeSettings[];
    goodbye: ReduxGoodbyeSettings[];
}