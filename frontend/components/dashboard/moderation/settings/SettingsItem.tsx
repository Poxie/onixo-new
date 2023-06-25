import { Checkbox } from '@/components/checkbox';
import styles from './ModSettings.module.scss';
import { useAuth } from '@/contexts/auth';
import { useGuildId } from '@/hooks/useGuildId';
import { useAppDispatch } from '@/redux/store';
import { updateModSetting } from '@/redux/dashboard/actions';
import { ReduxModSettings } from '@/types';

export const SettingsItem: React.FC<{
    id: keyof ReduxModSettings['settings'];
    title: string;
    description: string;
    onChange: (property: keyof ReduxModSettings['settings'], state: boolean) => void;
    checked?: boolean;
}> = ({ id, title, description, checked, onChange }) => {
    const guildId = useGuildId();
    const { patch } = useAuth();

    const dispatch = useAppDispatch();

    const toggleState = (newState: boolean) => {
        dispatch(updateModSetting(guildId, id, newState));

        patch(`/guilds/${guildId}/mod-settings`, {
            property: id,
            value: newState
        })
    }

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