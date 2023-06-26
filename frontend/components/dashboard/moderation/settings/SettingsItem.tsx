import styles from './ModSettings.module.scss';
import { Checkbox } from '@/components/checkbox';
import { ReduxModSettings } from '@/types';

export const SettingsItem: React.FC<{
    id: keyof ReduxModSettings['settings'];
    title: string;
    description: string;
    onChange: (property: keyof ReduxModSettings['settings'], state: boolean) => void;
    checked?: boolean;
}> = ({ id, title, description, checked, onChange }) => {
    return(
        <div className={styles['item']}>
            <div className={styles['item-text']}>
                <span>
                    {title}
                </span>
                <p>
                    {description}
                </p>
            </div>
            <Checkbox 
                onChange={state => onChange(id, state)}
                defaultChecked={checked}
                loading={checked === undefined}
            />
        </div>
    )
}