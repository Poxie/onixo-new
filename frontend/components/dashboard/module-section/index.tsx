import { ArrowIcon } from '@/assets/icons/ArrowIcon';
import styles from './ModuleSection.module.scss';
import { useState } from 'react';

export const ModuleSection: React.FC<{
    header: string;
    description: string;
    children: any;
    className?: string;
}> = ({ header, description, className, children }) => {
    const [open, setOpen] = useState(true);

    className = [
        styles['container'],
        !open ? styles['collapsed'] : '',
        className
    ].join(' ');
    return(
        <div className={className}>
            <button 
                className={styles['header']}
                onClick={() => setOpen(!open)}
            >
                <div className={styles['header-text']}>
                    <h2>
                        {header}
                    </h2>
                    <p>
                        {description}
                    </p>
                </div>
                <ArrowIcon />
            </button>
            <div className={styles['content-wrapper']}>
                <div className={styles['content']}>
                    {children}
                </div>
            </div>
        </div>
    )
}