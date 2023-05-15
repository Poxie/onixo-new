import { useRouter } from "next/router"

export const useGuildId = () => {
    const { guildId } = useRouter().query as { guildId: string };
    return guildId;
}