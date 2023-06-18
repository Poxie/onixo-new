export const getInviteLink = (guildId?: string) => (
    `https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&scope=bot&permissions=8` + (guildId ? `&guild_id=${guildId}` : '')
)