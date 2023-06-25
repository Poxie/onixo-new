import styles from './Automod.module.scss';
import Button from "@/components/button"

export const LinkPresetItem: React.FC<{
    id: string;
    text: string;
    active: boolean;
    onChange: (active: boolean) => void;
}> = ({ id, text, active, onChange }) => {
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
            <Button 
                type={active ? 'tertiary' : 'primary'}
                onClick={() => onChange(!active)}
            >
                {active ? 'Disable' : 'Enable'}
            </Button>
        </li>
    )
}