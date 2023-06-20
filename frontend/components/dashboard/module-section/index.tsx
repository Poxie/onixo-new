import React, { RefObject, useRef } from 'react';
import styles from './ModuleSection.module.scss';
import { ArrowIcon } from '@/assets/icons/ArrowIcon';
import { useState } from 'react';

export const ModuleContext = React.createContext({} as {
    open: boolean;
    setOpen: (state: boolean) => void;
    ref: RefObject<HTMLDivElement>;
})

export const useModuleSection = () => React.useContext(ModuleContext);

export const ModuleSection: React.FC<{
    header: string;
    description: string;
    children: any;
    className?: string;
}> = ({ header, description, className, children }) => {
    const [open, setOpen] = useState(true);
    const ref = useRef<HTMLDivElement>(null);

    const value = {
        setOpen,
        open,
        ref
    }

    className = [
        styles['container'],
        !open ? styles['collapsed'] : '',
        className
    ].join(' ');
    return(
        <ModuleContext.Provider value={value}>
            <div className={className} ref={ref}>
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
        </ModuleContext.Provider>
    )
}