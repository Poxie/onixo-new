import { useGuildId } from '@/hooks/useGuildId';
import { LinkPresetItem } from './LinkPresetItem';
import styles from './Moderation.module.scss';
import { useAppSelector } from '@/redux/store';
import { selectAntilinkById } from '@/redux/dashboard/selectors';
import { useMemo } from 'react';

const ID_TO_TEXT: {[key: string]: any} = {
    'discord': 'Discord',
    'youtube': 'YouTube',
    'twitter': 'Twitter',
    'twitch': 'Twitch',
    'instagram': 'Instagram',
    'facebook': 'Facebook'
}

export const LinkPresets = () => {
    const guildId = useGuildId();
    const antilink = useAppSelector(state => selectAntilinkById(state, guildId));

    const presets = useMemo(() => (
        Object.entries(antilink || [])
            .filter(([key, value]) => Object.keys(ID_TO_TEXT).includes(key))
            .map(([key, value]) => ({
                id: key,
                text: ID_TO_TEXT[key],
                active: value as boolean
            })
    )), [antilink]);

    if(!antilink) return null;

    return(
        <ul className={styles['presets']}>
            {presets.map(link => (
                <LinkPresetItem
                    {...link}
                    key={link.id}
                />
            ))}
        </ul>
    )
}