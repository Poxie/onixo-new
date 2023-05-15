export const getInviteLink = (guildId?: string) => (
    `https://discord.com/oauth2/authorize?client_id=814312727115071499&scope=bot&permissions=8` + (guildId ? `&guild_id=${guildId}` : '')
)