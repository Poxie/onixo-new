import { Guild, User } from "@/types";
import { getGuildIcon, getUserAvatar } from "./getImages";

export const replaceVariables = (text: string, member: User, guild: Guild) => (
    text
        .replaceAll('[server]', guild.name)
        .replaceAll('[sicon]', getGuildIcon(guild.id, guild.icon))
        .replaceAll('[name]', member.global_name)
        .replaceAll('[tag]', member.discriminator)
        .replaceAll('[uicon]', getUserAvatar(member.id, member.avatar))
        .replaceAll('|', '\n')
)