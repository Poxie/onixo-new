import { useAuth } from "@/contexts/auth";
import { useConfirmation } from "@/contexts/confirmation"
import { prependActivity } from "@/redux/dashboard/actions";
import { selectGuildChannels, selectGuildRoles } from "@/redux/dashboard/selectors";
import { AppDispatch, useAppDispatch, useAppSelector } from "@/redux/store";
import { Activity } from "@/types";
import { getUserAvatar } from "@/utils/getImages";
import { MutableRefObject, useCallback, useEffect, useRef } from "react";
import { AnyAction } from "redux";

const getPropertiesToUpdate: <T>(tempSettings: MutableRefObject<T>, prevSettings: MutableRefObject<T>) => Partial<T> = (tempSettings, prevSettings) => {
    if(!tempSettings.current || !prevSettings.current) return {};

    const propertiesToUpdate: {[key: string]: any} = {};
    Object.entries(tempSettings.current).forEach(([key, value]) => {
        if(!prevSettings.current) return;
        
        const isSame = JSON.stringify(prevSettings.current[key as keyof typeof prevSettings.current]) === JSON.stringify(value);
        if(!isSame) {
            propertiesToUpdate[key as any] = value as any;
        }
    });
    return propertiesToUpdate as Partial<typeof tempSettings.current>;
}

type Props<T> = {
    id: string;
    guildId: string;
    endpoint: string;
    dispatchAction: (guildId: string, settings: T) => AnyAction;
    updateAction: (guildId: string, property: keyof T, value: any) => AnyAction;
    selector: any;
    onConfirm?: (data: T) => void;
}
export const useHasChanges = <T>({ id, guildId, endpoint, onConfirm, dispatchAction, updateAction, selector }: Props<T>) => {
    const { addChanges, removeChanges, setIsLoading, reset } = useConfirmation();
    const { get, patch, token, user } = useAuth();
    const dispatch = useAppDispatch();

    const roles = useAppSelector(state => selectGuildRoles(state, guildId));
    const channels = useAppSelector(state => selectGuildChannels(state, guildId));
    const settings = useAppSelector(state => selector(state, guildId));

    const prevSettings = useRef<T>(typeof window !== 'undefined' ? structuredClone(settings) : undefined);
    const tempSettings = useRef<T>(typeof window !== 'undefined' ? structuredClone(settings) : undefined);

    useEffect(() => {
        if(!token || !guildId || settings) return;

        get<T>(endpoint, 'backend')
            .then(data => {
                prevSettings.current = structuredClone(data);
                tempSettings.current = structuredClone(data);
                dispatch(dispatchAction(guildId, data));
            })
    }, [get, token, endpoint, guildId, settings]);

    const updateChanges = useCallback(() => {
        if(!user || !tempSettings?.current || !prevSettings?.current) return

        const properties = getPropertiesToUpdate(tempSettings, prevSettings);
        
        setIsLoading(true);
        patch<T>(endpoint, properties)
            .then((data: T) => {
                const getChanges = () => {
                    return Object.entries(properties).map(([key, value]: [key: string, value: any]) => {
                        if(key.includes('channel')) {
                            const change: Activity['changes'][0] = {
                                previous_value: channels?.find(channel => channel.id === prevSettings.current[key as keyof T]),
                                new_value: channels?.find(channel => channel.id === tempSettings.current[key as keyof T]),
                                property: key
                            };
                            return change;
                        }
                        return {
                            property: key,
                            new_value: prevSettings.current[key as keyof T],
                            previous_value: prevSettings.current[key as keyof T],
                        } as Activity['changes'][0];
                    })
                }
                const activity: Activity = {
                    user: {
                        ...user,
                        avatar: getUserAvatar(user.id, user.avatar)
                    },
                    user_id: user.id,
                    guild_id: guildId,
                    timestamp: Date.now() / 1000,
                    action_id: id as Activity['action_id'],
                    changes: getChanges()
                }
                dispatch(prependActivity(guildId, activity));

                prevSettings.current = structuredClone(tempSettings.current);
                if(onConfirm) onConfirm(data);
                reset();
            })
    }, [patch, prevSettings, tempSettings, endpoint]);
    const revertChanges = useCallback(() => {
        if(!tempSettings.current || !prevSettings.current) return

        tempSettings.current = structuredClone(prevSettings.current);
        dispatch(dispatchAction(guildId, structuredClone(prevSettings.current)));
        reset();
    }, [prevSettings, tempSettings, guildId]);

    const updateProperty = useCallback((property: keyof T, value: any) => {
        if(!tempSettings?.current || !prevSettings?.current) return

        tempSettings.current[property] = value;
        dispatch(updateAction(guildId, property, value));

        // Checking if changes have been made
        const properties = getPropertiesToUpdate(tempSettings, prevSettings);
        if(Object.keys(properties).length === 0) {
            removeChanges(id);
        } else {
            addChanges({
                id,
                onCancel: revertChanges,
                onConfirm: updateChanges
            })
        }
    }, [tempSettings, prevSettings, updateChanges, revertChanges, guildId]);
 
    return { updateProperty };
}