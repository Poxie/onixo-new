import styles from './Moderation.module.scss';
import Button from "@/components/button"

export const LinkPresetItem: React.FC<{
    id: string;
    text: string;
    active: boolean;
}> = ({ id, text, active }) => {
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
            <Button type={active ? 'tertiary' : 'primary'}>
                {active ? 'Disable' : 'Enable'}
            </Button>
        </li>
    )
}