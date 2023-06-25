import { useGuildId } from '@/hooks/useGuildId';
import { LinkPresetItem } from './LinkPresetItem';
import styles from './Automod.module.scss';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { selectAntilinkById } from '@/redux/dashboard/selectors';
import { useEffect, useMemo, useRef } from 'react';
import { LinkPresetItemSkeleton } from './LinkPresetItemSkeleton';
import { useAuth } from '@/contexts/auth';
import { AutoMod } from '@/types';
import { addAutomod, updateAntilink } from '@/redux/dashboard/actions';
import { useConfirmation } from '@/contexts/confirmation';

const ID_TO_TEXT: {[key: string]: any} = {
    'discord': 'Discord',
    'youtube': 'YouTube',
    'twitter': 'Twitter',
    'twitch': 'Twitch',
    'instagram': 'Instagram',
    'facebook': 'Facebook'
}
const PLACEHOLDER_COUNT = Object.keys(ID_TO_TEXT).length;

const getPropertiesToUpdate = (tempSettings: AutoMod['antilink'], prevSettings: AutoMod['antilink']) => {
    const propertiesToUpdate: {[key: string]: boolean | string[]} = {};
    Object.entries(tempSettings).forEach(([key, value]) => {
        if(!prevSettings) return;
        
        const isSame = JSON.stringify(prevSettings[key as keyof typeof prevSettings]) === JSON.stringify(value);
        if(!isSame) {
            propertiesToUpdate[key] = value;
        }
    });
    return propertiesToUpdate;
}
export const LinkPresets = () => {
    const guildId = useGuildId();
    const { get, patch, token } = useAuth();
    const { addChanges, removeChanges, setIsLoading, reset } = useConfirmation();

    const dispatch = useAppDispatch();
    const antilink = useAppSelector(state => selectAntilinkById(state, guildId));

    const prevAntiLink = useRef(antilink);
    const tempAntiLink = useRef(antilink);

    useEffect(() => {
        if(!token || !guildId) return;

        get<AutoMod>(`/guilds/${guildId}/automod`, 'backend')
            .then(automod => {
                dispatch(addAutomod(automod))
                tempAntiLink.current = structuredClone(automod.antilink);
                prevAntiLink.current = structuredClone(automod.antilink);
            })
    }, [get, token, guildId]);

    const sendUpdateRequest = () => {
        if(!tempAntiLink.current || !prevAntiLink.current) return;

        setIsLoading(true);
        const properties = getPropertiesToUpdate(tempAntiLink.current, prevAntiLink.current);
        patch(`/guilds/${guildId}/antilink`, properties)
            .then(() => {
                prevAntiLink.current = structuredClone(tempAntiLink.current);
            })
            .catch(() => {

            })
            .finally(reset);
    }
    const revertChanges = () => {
        if(!tempAntiLink.current || !prevAntiLink.current) return;

        const properties = getPropertiesToUpdate(tempAntiLink.current, prevAntiLink.current);
        Object.keys(properties).forEach(key => {
            if(!prevAntiLink.current) return;
            dispatch(updateAntilink(guildId, key, prevAntiLink.current[key as keyof typeof prevAntiLink.current] as any));
        })
    }

    const updateProperty = (id: string, value: any) => {
        if(!tempAntiLink.current || !prevAntiLink.current) return;
        tempAntiLink.current[id as keyof AutoMod['antilink']] = value;
        dispatch(updateAntilink(guildId, id, value));

        const propertiesToUpdate = getPropertiesToUpdate(tempAntiLink.current, prevAntiLink.current);
        if(!Object.keys(propertiesToUpdate).length) {
            removeChanges('antilink');
        } else {
            addChanges({
                id: 'antilink',
                onCancel: revertChanges,
                onConfirm: sendUpdateRequest
            })
        }
    }

    const presets = useMemo(() => (
        Object.entries(antilink || [])
            .filter(([key, value]) => Object.keys(ID_TO_TEXT).includes(key))
            .map(([key, value]) => ({
                id: key,
                text: ID_TO_TEXT[key],
                active: value as boolean
            })
    )), [antilink]);

    if(!antilink) return (
        <ul className={styles['presets']}>
            {Array.from(Array(PLACEHOLDER_COUNT)).map((_,key) => (
                <LinkPresetItemSkeleton key={key} />
            ))}
        </ul>
    )

    return(
        <ul className={styles['presets']}>
            {presets.map(link => (
                <LinkPresetItem
                    {...link}
                    onChange={state => updateProperty(link.id, state)}
                    key={link.id}
                />
            ))}
        </ul>
    )
}