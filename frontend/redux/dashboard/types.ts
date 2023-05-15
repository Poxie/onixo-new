import { AutoMod, Guild, ReduxChannel } from "@/types"

export type DashboardState = {
    guilds: Guild[] | null;
    automod: AutoMod[];
    channels: ReduxChannel[];
}