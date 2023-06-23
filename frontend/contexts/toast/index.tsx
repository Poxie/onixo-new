import React, { useCallback, useState } from 'react';
import { ToastArgs, Toast as ToastType } from './types';
import styles from './Toast.module.scss';
import { Toast } from './Toast';
import { AnimatePresence } from 'framer-motion';

const ToastContext = React.createContext({} as {
    setToast: (toast: ToastArgs) => void;
});

export const useToast = () => React.useContext(ToastContext);

const DEFAULT_DURATION = 5000;
const DEFAULT_TYPE = 'info';
export const ToastProvider: React.FC<{
    children: any;
}> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastType[]>([]);

    const setToast = useCallback((toast: ToastArgs) => {
        // Giving the toast a unique id
        if(!toast.id) toast.id = Math.random().toString();

        // If no values are provided, use default
        if(!toast.duration) toast.duration = DEFAULT_DURATION;
        if(!toast.type) toast.type = DEFAULT_TYPE;

        // Add toast to start of toasts array
        setToasts(prev => prev.concat(toast as ToastType));

        // Removing toast after duration
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== toast.id));
        }, toast.duration);
    }, [setToasts]);

    const value = {
        setToast
    }
    return(
        <ToastContext.Provider value={value}>
            {children}
            <div className={styles['container']}>
                <AnimatePresence>
                    {toasts.map(toast => (
                        <Toast 
                            {...toast}
                            key={toast.id}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    )
}