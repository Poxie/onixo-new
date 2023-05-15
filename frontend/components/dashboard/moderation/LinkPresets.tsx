import { LinkPresetItem } from './LinkPresetItem';
import styles from './Moderation.module.scss';

const PRESETS = [
    { text: 'Discord', id: 'discord' },
    { text: 'YouTube', id: 'youtube' },
    { text: 'Twitch', id: 'twitch' },
    { text: 'Instagram', id: 'instagram' },
    { text: 'Twitter', id: 'twitter' },
    { text: 'Facebook', id: 'facebook' },
]
export type LinkPreset = typeof PRESETS[0];

export const LinkPresets = () => {
    return(
        <ul className={styles['presets']}>
            {PRESETS.map(preset => (
                <LinkPresetItem 
                    {...preset}
                    key={preset.id}
                />
            ))}
        </ul>
    )
}