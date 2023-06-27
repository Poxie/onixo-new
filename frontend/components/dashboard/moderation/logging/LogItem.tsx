import styles from './Logging.module.scss'
import { ItemList } from "../../item-list";
import { ReduxLogs } from '@/types';

export const LogItem: React.FC<{
    type: keyof ReduxLogs['logChannels'];
    onChange: (channelId: string | null) => void;
    active?: string | null;
}> = ({ type, onChange, active }) => {
    const action = type.split('_')[0];
    const actionTitle = action.slice(0,1).toUpperCase() + action.slice(1);
    return(
        <div className={styles['action']}>
            <div className={styles['action-text']}>
                <p>
                    {actionTitle} log channel
                </p>
                <span>
                    {actionTitle} logs will appear in this channel.
                </span>
            </div>
            <ItemList 
                onChange={onChange}
                defaultActive={active}
                loading={active === undefined}
            />
        </div>
    )
}