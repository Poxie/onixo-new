declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_WEBSITE_NAME: string;
            NEXT_PUBLIC_API_ENDPOINT: string;
            NEXT_PUBLIC_DISCORD_API: string;
            NEXT_PUBLIC_CLIENT_ID: string;
            NEXT_PUBLIC_REDIRECT_URI: string;
            NEXT_PUBLIC_CHARGEBEE_SITE: string;
            NEXT_PUBLIC_FRONTEND_ORIGIN: string;
            NEXT_PUBLIC_SUPPORT_SERVER: string;
            NEXT_PUBLIC_WEBSOCKET_ORIGIN: string;
        }
    }
}

export {}