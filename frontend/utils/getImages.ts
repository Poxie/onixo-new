export const getUserAvatar = (userId: string, avatar: string) => (
    `https://cdn.discordapp.com/avatars/${userId}/${avatar}.png`
)
export const getGuildIcon = (guildId: string, icon: string) => (
    `https://cdn.discordapp.com/icons/${guildId}/${icon}.png`
)