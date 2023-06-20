export const getInviteLink = (guildId?: string) => (
    `https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&scope=bot&permissions=8` + (guildId ? `&guild_id=${guildId}` : '')
)

export const getLoginLink = () => (
    `
https://discord.com/oauth2/authorize\
?response_type=code\
&client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}\
&scope=identify%20guilds\
&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_REDIRECT_URI as string)}
    `
)