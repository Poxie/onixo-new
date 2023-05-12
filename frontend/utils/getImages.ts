export const getUserAvatar = (userId: string, avatar: string) => (
    `https://cdn.discordapp.com/avatars/${userId}/${avatar}.png`
)