import { AutoMod, Guild, ReduxActionLogs, ReduxChannel } from "@/types"

export type DashboardState = {
    guilds: Guild[] | null;
    automod: AutoMod[];
    channels: ReduxChannel[];
    actionLogs: ReduxActionLogs[];
}