import styles from './Features.module.scss';
import { QuickActions } from "../quick-actions";
import { useEffect, useState } from 'react';

export const SideActions: React.FC<{
    onClick: (text: string) => void;
    active: string | null;
}> = ({ onClick, active }) => {
    const [visible, setVisible] = useState(false);

    // Checking if quick actions exceed viewport. If so, display the side actions
    useEffect(() => {
        const onScroll = () => {
            const header = document.querySelector(`[data-feature-header]`);
            if(!header) return;
            
            const { top, height } = header.getBoundingClientRect();
            
            const distanceFromTop = top + height / 1.5;
            setVisible(distanceFromTop < 0);
        }
        onScroll();

        document.addEventListener('scroll', onScroll);
        return () => document.removeEventListener('scroll', onScroll);
    }, []);

    const className = [
        styles['side-actions'],
        visible ? styles['visible'] : ''
    ].join(' ');
    return(
        <QuickActions 
            active={active}
            onClick={onClick}
            className={className}
        />
    )
}