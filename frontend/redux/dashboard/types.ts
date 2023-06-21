import { AutoMod, Guild, ReduxActionLogs, ReduxChannel, ReduxModSettings, ReduxWelcomeSettings } from "@/types"

export type DashboardState = {
    guilds: Guild[] | null;
    automod: AutoMod[];
    channels: ReduxChannel[];
    actionLogs: ReduxActionLogs[];
    modSettings: ReduxModSettings[];
    welcome: ReduxWelcomeSettings[];
}