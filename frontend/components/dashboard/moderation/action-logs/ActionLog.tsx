import styles from './ActionLogs.module.scss'
import { ItemList } from "../../item-list";

export const ActionLog: React.FC<{
    type: 'ban' | 'kick' | 'mute' | 'warn';
    onChange: (type: string, channelId: string) => void;
}> = ({ type, onChange }) => {
    const typeTitle = type.slice(0,1).toUpperCase() + type.slice(1)
    return(
        <div className={styles['action']}>
            <div className={styles['action-text']}>
                <p>
                    {typeTitle} log channel
                </p>
                <span>
                    {typeTitle} logs will appear in this channel.
                </span>
            </div>
            <ItemList 
                onChange={channelId => onChange(type, channelId)}
            />
        </div>
    )
}