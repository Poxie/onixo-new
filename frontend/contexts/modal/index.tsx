import { motion } from 'framer-motion';
import styles from '../../modals/Modal.module.scss';
import React, { ReactElement, useCallback, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Modal } from '../../modals/Modal';
import { ModalContainer } from '../../modals/ModalContainer';

type ModalContextType = {
    setModal: (modal: ReactElement) => void;
    pushModal: (modal: ReactElement) => void;
    goBack: () => void;
    close: () => void;
}

const ModalContext = React.createContext({} as ModalContextType);

export const useModal = () => React.useContext(ModalContext);

export const ModalProvider: React.FC<{
    children: any;
}> = ({ children }) => {
    const [modals, setModals] = useState<ReactElement[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [height, setHeight] = useState<number | string>(0);

    // Setting modal
    const _setModal: ModalContextType['setModal'] = useCallback(modal => {
        setModals([modal]);
        document.body.style.overflow = 'hidden';
    }, [setModals]);

    // Pushing modal
    const _pushModal: ModalContextType['pushModal'] = useCallback(modal => {
        setModals(prev => [...prev, ...[modal]]);
        setActiveIndex(prev => prev + 1);
    }, [setModals]);

    // Going to previous modal
    const _goBack: ModalContextType['goBack'] = useCallback(() => {
        setActiveIndex(prev => {
            if(prev <= 0) return prev;
            return prev - 1;
        })
        setTimeout(() => {
            setModals(prev => {
                if(prev.length <= 1) return prev;
                const newModals = [...prev];
                newModals.pop();
                return newModals;
            })
        }, 500);
    }, [setModals, setActiveIndex]);

    // Closing modal
    const close = useCallback(() => {
        setModals([]);
        setActiveIndex(0);
        setHeight(0);
        document.body.style.overflow = '';
    }, []);

    const value = {
        setModal: _setModal,
        pushModal: _pushModal,
        goBack: _goBack,
        close
    }
    return(
        <ModalContext.Provider value={value}>
            {children}

            <AnimatePresence>
                {modals.length && (
                    <>
                    <Modal activeIndex={activeIndex} height={height}>
                        {modals.map((modal, key) => (
                            <ModalContainer 
                                active={key === activeIndex}
                                setHeight={setHeight}
                                height={height}
                                key={key}
                            >
                                {modal}
                            </ModalContainer>
                        ))}
                    </Modal>
                    <motion.div 
                        className={styles['backdrop']}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={close}
                    />
                    </>
                )}
            </AnimatePresence>
        </ModalContext.Provider>
    )
}