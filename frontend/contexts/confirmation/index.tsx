import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { Confirmation } from './Confmation';

type Callback = {
    id: string;
    onConfirm: () => void;
    onCancel: () => void;
};
type ContextType = {
    addChanges: (callback: Callback) => void;
    removeChanges: (id: string) => void;
    setIsLoading: (state: boolean) => void;
    reset: () => void;
}
const ConfirmationContext = React.createContext({} as ContextType);

export const useConfirmation = () => React.useContext(ConfirmationContext);

const WARNING_DURATION = 800;
export const ConfimationProvider: React.FC<{
    children: any;
}> = ({ children }) => {
    const router = useRouter();

    const [hasChanges, setHasChanges] = useState<Callback[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errored, setErrored] = useState(false);

    const timeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const routeChangeStart = (url: string) => {
            if(timeout.current) {
                clearTimeout(timeout.current);
                setErrored(false);
            }
            setTimeout(() => setErrored(true), 10);
            timeout.current = setTimeout(() => {
                setErrored(false);
                timeout.current = null;
            }, WARNING_DURATION);

            router.events.emit('routeChangeError');

            // tslint:disable-next-line: no-string-throw
            throw `Route change to "${url}" was aborted (this error can be safely ignored).`;
        }

        if(hasChanges.length) {
            router.events.on('routeChangeStart', routeChangeStart);
        }

        return () => router.events.off('routeChangeStart', routeChangeStart);
    }, [hasChanges.length]);

    const addChanges = (callback: Callback) => {
        setHasChanges(prev => prev.filter(change => change.id !== callback.id).concat(callback));
    }

    const confirm = () => {
        hasChanges.length && hasChanges.forEach(change => change?.onConfirm());
    }
    const cancel = () => {
        hasChanges.length && hasChanges.forEach(change => change.onCancel());
        setHasChanges([]);
    }
    const reset = () => {
        setHasChanges([]);
        setIsLoading(false);
    }
    const removeChanges = (id: string) => {
        setHasChanges(prev => prev.filter(change => change.id !== id));
    }

    const value = {
        addChanges,
        removeChanges,
        setIsLoading,
        reset,
    }
    return(
        <ConfirmationContext.Provider value={value}>
            {children}
            <AnimatePresence>
                {hasChanges.length !== 0 && (
                    <Confirmation
                        loading={isLoading}
                        onConfirm={confirm}
                        onCancel={cancel}
                        errored={errored}
                    />
                )}
            </AnimatePresence>
        </ConfirmationContext.Provider>
    )
}