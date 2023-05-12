declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_WEBSITE_NAME: string;
            NEXT_PUBLIC_API_ENDPOINT: string;
            NEXT_PUBLIC_DISCORD_API: string;
            NEXT_PUBLIC_CLIENT_ID: string;
            NEXT_PUBLIC_REDIRECT_URI: string;
        }
    }
}

export {}