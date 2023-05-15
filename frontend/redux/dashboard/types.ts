import { AutoMod, Guild } from "@/types"

export type DashboardState = {
    guilds: Guild[] | null;
    automod: AutoMod[];
}