import { useGuildId } from '@/hooks/useGuildId';
import { LinkPresetItem } from './LinkPresetItem';
import styles from './Automod.module.scss';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { selectAntilinkById } from '@/redux/dashboard/selectors';
import { MutableRefObject, useEffect, useMemo, useRef } from 'react';
import { LinkPresetItemSkeleton } from './LinkPresetItemSkeleton';
import { useAuth } from '@/contexts/auth';
import { setAntiLink, updateAntilink } from '@/redux/dashboard/actions';
import { ReduxAntiLink } from '@/types';
import { useHasChanges } from '@/hooks/useHasChanges';

const ID_TO_TEXT: {[key: string]: any} = {
    'discord': 'Discord',
    'youtube': 'YouTube',
    'twitter': 'Twitter',
    'twitch': 'Twitch',
    'instagram': 'Instagram',
    'facebook': 'Facebook'
}
const PLACEHOLDER_COUNT = Object.keys(ID_TO_TEXT).length;

export const LinkPresets = () => {
    const guildId = useGuildId();
    const { get, token } = useAuth();

    const dispatch = useAppDispatch();
    const antilink = useAppSelector(state => selectAntilinkById(state, guildId));

    const prevAntiLink = useRef(antilink);
    const tempAntiLink = useRef(antilink);

    const { updateProperty } = useHasChanges<ReduxAntiLink['antiLink']>({
        guildId,
        id: 'anti-link',
        dispatchAction: setAntiLink,
        updateAction: updateAntilink,
        endpoint: `/guilds/${guildId}/anti-link`,
        prevSettings: prevAntiLink as MutableRefObject<ReduxAntiLink['antiLink']>,
        tempSettings: tempAntiLink as MutableRefObject<ReduxAntiLink['antiLink']>,
    })

    useEffect(() => {
        if(!token || !guildId) return;

        get<ReduxAntiLink['antiLink']>(`/guilds/${guildId}/anti-link`, 'backend')
            .then(automod => {
                dispatch(setAntiLink(guildId, automod))
                tempAntiLink.current = structuredClone(automod);
                prevAntiLink.current = structuredClone(automod);
            })
    }, [get, token, guildId]);

    const presets = useMemo(() => (
        Object.entries(antilink || [])
            .filter(([key, value]) => Object.keys(ID_TO_TEXT).includes(key))
            .map(([key, value]) => ({
                id: key as keyof Omit<NonNullable<typeof antilink>, 'custom'>,
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