import { useAuth } from "@/contexts/auth";
import { setGuilds } from "@/redux/dashboard/actions";
import { selectGuildIds, selectGuilds } from "@/redux/dashboard/selectors";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Guild } from "@/types";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const DashAuthLayout: React.FC<{
    children: any;
}> = ({ children }) => {
    const router = useRouter();
    const { guildId } = router.query as { guildId?: string };
    const { get, token } = useAuth();
    
    const dispatch = useAppDispatch();
    const guildIds = useAppSelector(selectGuildIds);

    // If guilds are not fetched, fetch them
    useEffect(() => {
        if(guildIds || !token) return;

        get<Guild[]>(`/guilds`, 'backend')
            .then(guilds => {
                dispatch(setGuilds(guilds));
            })
    }, [guildIds, token]);

    // If user is not admin/part of guild, return user to dash selection
    useEffect(() => {
        if(!guildIds || !guildId) return;

        if(!guildIds?.includes(guildId)) {
            router.replace(`/dashboard`, undefined, { shallow: true });
        }
    }, [guildIds]);

    return children;
}