/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.discordapp.com']
  },
  async redirects() {
    return [
      {
        source: '/invite',
        destination: 'https://discord.com/oauth2/authorize?client_id=814312727115071499&scope=bot&permissions=8',
        permanent: true,
        basePath: false
      },
      {
        source: '/support',
        destination: 'https://discord.gg/aEGcHWZBA3',
        permanent: true,
        basePath: false
      },
      {
        source: '/dashboard/:guildId/moderation',
        destination: '/dashboard/:guildId/moderation/automod',
        permanent: true,
      }
    ]
  }
}

module.exports = nextConfig
