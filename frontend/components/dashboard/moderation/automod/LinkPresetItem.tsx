import { useAuth } from '@/contexts/auth';
import styles from './Automod.module.scss';
import Button from "@/components/button"
import { useAppDispatch } from '@/redux/store';
import { updateAntilink } from '@/redux/dashboard/actions';
import { useGuildId } from '@/hooks/useGuildId';

export const LinkPresetItem: React.FC<{
    id: string;
    text: string;
    active: boolean;
}> = ({ id, text, active }) => {
    const guildId = useGuildId();
    const { patch } = useAuth();

    const dispatch = useAppDispatch();
    
    const toggleSetting = () => {
        dispatch(updateAntilink(guildId, id, !active))
        patch(`/guilds/${guildId}/antilink`, { property: id, value: !active })
            .catch(() => {      
                dispatch(updateAntilink(guildId, id, active))
            })
    }

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
                onClick={toggleSetting}
            >
                {active ? 'Disable' : 'Enable'}
            </Button>
        </li>
    )
}