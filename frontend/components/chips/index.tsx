import { useState } from 'react';
import styles from './Chips.module.scss';

export type Chip = {
    id: string;
    text: string;
}

export const Chips: React.FC<{
    chips: Chip[];
    onChange?: (chipId: string) => void;
    defaultActive?: string;
    className?: string;
}> = ({ chips, defaultActive, onChange, className }) => {
    const [activeChip, setActiveChip] = useState(defaultActive || chips[0].id);

    const handleChange = (chipId: string) => {
        setActiveChip(chipId);
        onChange && onChange(chipId);
    }

    className = [
        styles['container'],
        className
    ].join(' ');
    return(
        <ul className={className}>
            {chips.map(chip => {
                const active = chip.id === activeChip;

                const className = [
                    styles['item'],
                    active ? styles['active'] : ''
                ].join(' ');
                return(
                    <li key={chip.id}>
                        <button 
                            className={className}
                            onClick={() => handleChange(chip.id)}
                        >
                            {chip.text}
                        </button>
                    </li>
                )
            })}
        </ul>
    )
}