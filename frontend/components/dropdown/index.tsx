import { useState } from 'react';
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
}> = ({ items, active, onChange, placeholder }) => {
    const [open, setOpen] = useState(false);
    
    const activeItem = items.find(item => item.id === active);
    return(
        <div className={styles['container']}>
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
                    >
                        <CloseIcon />
                    </button>
                ) : (
                    <ArrowIcon />
                )}
            </span>
            {open && (
                <ul className={styles['items']}>
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