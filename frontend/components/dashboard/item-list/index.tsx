import styles from './ItemList.module.scss'
import { useGuildId } from "@/hooks/useGuildId"
import { selectGuildChannelIds } from "@/redux/dashboard/selectors";
import { useAppSelector } from "@/redux/store";
import { ListItem } from "./ListItem";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SelectedItem } from './SelectedItem';
import { ArrowIcon } from '@/assets/icons/ArrowIcon';
import { useModuleSection } from '../module-section';

export const ItemList: React.FC<{
    onChange?: (itemId: string | null) => void;
    defaultActive?: string;
    loading?: boolean;
}> = ({ defaultActive=null, onChange, loading=false }) => {
    const guildId = useGuildId();
    const channelIds = useAppSelector(state => selectGuildChannelIds(state, guildId));
    const { ref: container } = useModuleSection();

    const [open, setOpen] = useState(false);
    const [direction, setDirection] = useState<'top' | 'bottom'>('top');
    const [activeId, setActiveId] = useState<string | null>(defaultActive);
    const ref = useRef<HTMLButtonElement>(null);
    const items = useRef<HTMLUListElement>(null);

    // If default active changes, update active
    useEffect(() => setActiveId(defaultActive), [defaultActive]);

    // If dropdown exceeds parent, change direction of popup items
    useLayoutEffect(() => {
        if(!items.current || !container.current) return;

        const { top: itemTop, height: itemHeight } = items.current.getBoundingClientRect();
        const { top: containerTop, height: containerHeight } = container.current.getBoundingClientRect();

        const containerTotal = containerTop + containerHeight;
        const itemTotal = itemTop + itemHeight;

        setDirection(itemTotal > containerTotal ? 'top' : 'bottom');
    }, [open, container.current]);

    const handleChange = (itemId: string | null, e: React.MouseEvent) => {
        setOpen(false);
        setActiveId(itemId)
        onChange && onChange(itemId);
    }
    const handleClick = (e: React.MouseEvent) => {
        // Checks if click is on selected item item, if so return
        if(e.currentTarget.contains(ref.current)) return;

        setOpen(prev => !prev);
    }

    const className = [
        styles['container'],
        open ? styles['expanded'] : '',
        styles[direction]
    ].join(' ');
    return(
        <div className={className}>
            <div className={styles['selected']}>
                <button 
                    className={styles['selected-button']}
                    onClick={handleClick}
                    disabled={loading}
                    aria-label="Select channhels"
                />
                <div className={styles['selected-main']}>
                    {loading ? (
                        <div className={styles['loading']} />
                    ) : (
                        activeId ? (
                            <SelectedItem 
                                id={activeId}
                                guildId={guildId}
                                onClick={e => handleChange(null, e)}
                                ref={ref}
                            />
                        ) : (
                            <span>
                                No channel selected.
                            </span>
                        )
                    )}
                </div>
                <ArrowIcon />
            </div>
            <ul className={styles['items']} ref={items}>
                {channelIds?.map(channelId => (
                    <ListItem 
                        id={channelId}
                        guildId={guildId}
                        onClick={handleChange}
                        key={channelId}
                    />
                ))}
            </ul>
        </div>
    )
}