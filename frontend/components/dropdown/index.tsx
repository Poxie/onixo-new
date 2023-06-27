import { useEffect, useRef, useState } from 'react';
import styles from './Dropdown.module.scss';
import { ArrowIcon } from '@/assets/icons/ArrowIcon';
import { CloseIcon } from '@/assets/icons/CloseIcon';

export const Dropdown: React.FC<{
    items: {
        id: string;
        text: string;
    }[];
    active: string | null;
    onChange: (id: string | null) => void;
    placeholder?: string;
    containerClassName?: string;
    itemsClassName?: string;
}> = ({ items, active, onChange, placeholder, containerClassName, itemsClassName }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Closing on click outside component
    useEffect(() => {
        const checkForClickOutside = (e: MouseEvent) => {
            // @ts-ignore: this works
            if(ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', checkForClickOutside);
        return () => document.removeEventListener('mousedown', checkForClickOutside);
    }, []);

    // Setting up classNames
    containerClassName = [
        styles['container'],
        containerClassName
    ].join(' ');
    itemsClassName = [
        styles['items'],
        itemsClassName
    ].join(' ');
    
    const activeItem = items.find(item => item.id === active);
    return(
        <div 
            className={containerClassName} 
            ref={ref}
        >
            <span className={styles['selected']}>
                <button 
                    className={styles['toggle-button']} 
                    aria-label={placeholder || "Select filter"}
                    onClick={() => setOpen(!open)}
                />
                {activeItem?.text || placeholder || 'No item selected.'}
                {activeItem ? (
                    <button 
                        className={styles['reset-button']}
                        onClick={() => {
                            onChange(null);
                            setOpen(false);
                        }}
                        aria-label={`Reset item`}
                    >
                        <CloseIcon />
                    </button>
                ) : (
                    <ArrowIcon />
                )}
            </span>
            {open && (
                <ul className={itemsClassName}>
                    {items.map(item => (
                        <li key={item.id}>
                            <button 
                                onClick={() => {
                                    onChange(item.id);
                                    setOpen(false);
                                }}>
                                {item.text}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}