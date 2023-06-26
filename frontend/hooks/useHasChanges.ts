import { useAuth } from "@/contexts/auth";
import { useConfirmation } from "@/contexts/confirmation"
import { AppDispatch, useAppDispatch } from "@/redux/store";
import { MutableRefObject, useCallback } from "react";

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
    tempSettings: MutableRefObject<T> | undefined;
    prevSettings: MutableRefObject<T> | undefined;
    endpoint: string;
    dispatchAction: any;
    updateAction: any;
    onConfirm?: (data: T) => void;
}
export const useHasChanges = <T>({ id, guildId, tempSettings, prevSettings, endpoint, onConfirm, dispatchAction, updateAction }: Props<T>) => {
    const { addChanges, removeChanges, setIsLoading, reset } = useConfirmation();
    const { patch } = useAuth();
    const dispatch = useAppDispatch();

    const updateChanges = useCallback(() => {
        if(!tempSettings?.current || !prevSettings?.current) return

        const properties = getPropertiesToUpdate(tempSettings, prevSettings);
        console.log(properties);
        
        setIsLoading(true);
        patch<T>(endpoint, properties)
            .then((data: T) => {
                prevSettings.current = structuredClone(tempSettings.current);
                if(onConfirm) onConfirm(data);
                reset();
            })
    }, [prevSettings, tempSettings, endpoint]);
    const revertChanges = useCallback(() => {
        if(!tempSettings || !prevSettings) return

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