import styles from './ItemList.module.scss'
import { useGuildId } from "@/hooks/useGuildId"
import { selectGuildChannelIds } from "@/redux/dashboard/selectors";
import { useAppSelector } from "@/redux/store";
import { ListItem } from "./ListItem";
import { useEffect, useState } from "react";
import { SelectedItem } from './SelectedItem';

export const ItemList: React.FC<{
    onChange?: (itemId: string) => void;
    defaultActive?: string;
}> = ({ defaultActive, onChange }) => {
    const guildId = useGuildId();
    const channelIds = useAppSelector(state => selectGuildChannelIds(state, guildId));

    const [open, setOpen] = useState(false);
    const [activeId, setActiveId] = useState(defaultActive);

    const handleChange = (itemId: string) => {
        setOpen(false);
        setActiveId(itemId)
        onChange && onChange(itemId);
    }

    return(
        <div className={styles['container']}>
            <button 
                className={styles['selected']}
                onClick={() => setOpen(!open)}
            >
                {activeId ? (
                    <SelectedItem 
                        id={activeId}
                        guildId={guildId}
                    />
                ) : (
                    <span>
                        No channel selected.
                    </span>
                )}
            </button>
            {open && (
                <ul className={styles['items']}>
                    {channelIds?.map(channelId => (
                        <ListItem 
                            id={channelId}
                            guildId={guildId}
                            onClick={handleChange}
                            key={channelId}
                        />
                    ))}
                </ul>
            )}
        </div>
    )
}