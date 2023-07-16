import styles from './ItemList.module.scss'
import { useGuildId } from "@/hooks/useGuildId"
import { useAppSelector } from "@/redux/store";
import { ListItem } from "./ListItem";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { SelectedItem } from './SelectedItem';
import { ArrowIcon } from '@/assets/icons/ArrowIcon';
import { useModuleSection } from '../module-section';
import { Input } from '@/components/input';
import { selectGuildChannels } from '@/redux/slices/dashboard';

export const ItemList: React.FC<{
    onChange?: (itemId: string | null) => void;
    defaultActive?: string | null;
    loading?: boolean;
}> = ({ defaultActive=null, onChange, loading=false }) => {
    const guildId = useGuildId();
    const channels = useAppSelector(state => selectGuildChannels(state, guildId));
    const { ref: section } = useModuleSection();

    const [open, setOpen] = useState(false);
    const [direction, setDirection] = useState<'top' | 'bottom'>('top');
    const [activeId, setActiveId] = useState<string | null>(defaultActive);
    const [search, setSearch] = useState('');

    const container = useRef<HTMLDivElement>(null)
    const ref = useRef<HTMLButtonElement>(null);
    const items = useRef<HTMLDivElement>(null);

    // If default active changes, update active
    useEffect(() => setActiveId(defaultActive), [defaultActive]);

    // If dropdown exceeds parent, change direction of popup items
    useLayoutEffect(() => {
        if(!items.current || !section.current) return;

        const { top: itemTop, height: itemHeight } = items.current.getBoundingClientRect();
        const { top: sectionTop, height: sectionHeight } = section.current.getBoundingClientRect();

        const sectionTotal = sectionTop + sectionHeight;
        const itemTotal = itemTop + itemHeight;

        setDirection(itemTotal > sectionTotal ? 'top' : 'bottom');
    }, [open, section.current]);

    // Closing on click outside component
    useEffect(() => {
        const checkForClickOutside = (e: MouseEvent) => {
            // @ts-ignore: this works
            if(container.current && !container.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', checkForClickOutside);
        return () => document.removeEventListener('mousedown', checkForClickOutside);
    }, []);

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

    const filteredChannels = useMemo(() => channels?.filter(channel => (
        !search ? channel : channel.name.toLowerCase().includes(search.toLowerCase())
    )), [channels, search]);

    const className = [
        styles['container'],
        open ? styles['expanded'] : '',
        styles[direction]
    ].join(' ');
    return(
        <div className={className} ref={container}>
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
            <div className={styles['items']} ref={items}>
                <Input 
                    placeholder={'Search'}
                    containerClassName={styles['input']}
                    onChange={setSearch}
                    focusOnMount
                />
                <ul className={styles['item-list']}>
                    {filteredChannels?.map(channel => (
                        <ListItem 
                            {...channel}
                            guildId={guildId}
                            onClick={handleChange}
                            key={channel.id}
                        />
                    ))}
                </ul>
                {filteredChannels?.length === 0 && (
                    <span className={styles['muted']}>
                        No channels were found.
                    </span>
                )}
            </div>
        </div>
    )
}