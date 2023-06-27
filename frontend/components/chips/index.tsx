import { useEffect, useState } from 'react';
import styles from './Chips.module.scss';
import { useRouter } from 'next/router';

export type Chip = {
    id: string;
    text: string;
}

export const Chips: React.FC<{
    chips: Chip[];
    basePath?: string;
    onChange?: (chipId: string) => void;
    defaultActive?: string;
    className?: string;
}> = ({ chips, defaultActive, onChange, basePath, className }) => {
    const router = useRouter();
    const [activeChip, setActiveChip] = useState(defaultActive || chips[0].id);

    // Updates active chip on default change
    useEffect(() => {
        if(!defaultActive) return;
        setActiveChip(defaultActive);
    }, [defaultActive]);

    const handleChange = async (chipId: string) => {
        // If basepath, redirect user on chip click to correct path
        if(basePath) {
            await router.push(`${basePath}/${chipId}`);
        }

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