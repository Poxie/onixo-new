import styles from './Moderation.module.scss';
import Button from "@/components/button"
import { LinkPreset } from "./LinkPresets"

export const LinkPresetItem: React.FC<LinkPreset> = ({ id, text }) => {
    return(
        <li className={styles['preset-item']}>
            <div className={styles['preset-text']}>
                <p>
                    {text}
                </p>
                <span>
                    Remove {text} links
                </span>
            </div>
            <Button type={'tertiary'}>
                Enabled
            </Button>
        </li>
    )
}