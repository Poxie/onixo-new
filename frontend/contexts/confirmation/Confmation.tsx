import styles from './Confirmation.module.scss';
import Button from "@/components/button"
import { motion } from 'framer-motion';
import { useLayoutEffect, useRef, useState } from 'react';

const EXTRA_SPACING = 100;
export const Confirmation: React.FC<{
    onConfirm: () => void;
    onCancel: () => void;
    errored: boolean;
    loading: boolean;
}> = ({ onCancel, onConfirm, errored, loading }) => {
    const [height, setHeight] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const onResize = () => {
            if(!ref.current) return;
            setHeight(ref.current.offsetHeight);
        }
        onResize();

        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [])

    return(
        <motion.div 
            className={`${styles['container']} ${errored ? styles['error'] : ''}`}
            initial={{ top: '102%' }}
            exit={{ top: '102%' }}
            animate={{ top: `calc(100% - ${height}px - var(--spacing-quaternary))` }}
            transition={{ duration: .2 }}
            ref={ref}
        >
            <span>
                Changes detected! Don't let them go to waste.
            </span>
            <div className={styles['buttons']}>
                <Button 
                    type={'transparent'}
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    disabled={loading}
                >
                    Confirm Changes
                </Button>
            </div>
        </motion.div>
    )
}