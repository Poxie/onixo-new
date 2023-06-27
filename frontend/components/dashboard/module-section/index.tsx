import React, { RefObject, useEffect, useRef } from 'react';
import styles from './ModuleSection.module.scss';
import { ArrowIcon } from '@/assets/icons/ArrowIcon';
import { useState } from 'react';
import { Checkbox } from '@/components/checkbox';

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
    onEnableToggle?: (state: boolean) => void;
    enabled?: boolean;
}> = ({ header, description, className, onEnableToggle, enabled, children }) => {
    const [open, setOpen] = useState(enabled !== undefined ? enabled : true);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(enabled === undefined) return;
        setOpen(enabled);
    }, [enabled]);

    const onChange = (state: boolean) => {
        setOpen(state);
        
        if(onEnableToggle) {
            onEnableToggle(state);
        }
    }

    const value = {
        setOpen,
        open,
        ref
    }

    className = [
        styles['container'],
        !open ? styles['collapsed'] : '',
        !enabled ? styles['disabled'] : '',
        onEnableToggle ? styles['enableable'] : '',
        className
    ].join(' ');
    return(
        <ModuleContext.Provider value={value}>
            <div className={className} ref={ref}>
                <div className={styles['header']}>
                    <button 
                        className={styles['toggle-collapse']}
                        aria-label={`${open ? 'Collapse' : 'Expand'} module section`}
                        onClick={() => setOpen(!open)}
                        disabled={!enabled && onEnableToggle !== undefined}
                    />
                    <div className={styles['header-text']}>
                        <h2>
                            {header}
                        </h2>
                        <p>
                            {description}
                        </p>
                    </div>
                    <div className={styles['header-options']}>
                        {onEnableToggle && (
                            <div className={styles['enable-toggle']}>
                                <label htmlFor={header.toLowerCase()}>
                                    Enable this module
                                </label>
                                <Checkbox
                                    loading={onEnableToggle !== undefined && enabled === undefined} 
                                    defaultChecked={enabled}
                                    onChange={onChange}
                                    id={header.toLowerCase()}
                                />
                            </div>
                        )}
                        <div className={styles['arrow-icon']}>
                            <ArrowIcon />
                        </div>
                    </div>
                </div>
                <div className={styles['content-wrapper']}>
                    <div className={styles['content']}>
                        {children}
                    </div>
                </div>
            </div>
        </ModuleContext.Provider>
    )
}