import { useGuildId } from '@/hooks/useGuildId';
import { LinkPresetItem } from './LinkPresetItem';
import styles from './Automod.module.scss';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { selectAntilinkById } from '@/redux/dashboard/selectors';
import { useMemo } from 'react';
import { LinkPresetItemSkeleton } from './LinkPresetItemSkeleton';
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

    const antilink = useAppSelector(state => selectAntilinkById(state, guildId));

    const { updateProperty } = useHasChanges<ReduxAntiLink['antiLink']>({
        guildId,
        id: 'moderation',
        dispatchAction: setAntiLink,
        updateAction: updateAntilink,
        selector: selectAntilinkById,
        endpoint: `/guilds/${guildId}/anti-link`,
    })

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