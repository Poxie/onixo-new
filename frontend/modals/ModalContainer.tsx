import { useScreenSizes } from '@/hooks/useScreenSizes';
import styles from './Modal.module.scss'
import { motion } from 'framer-motion';
import { ReactElement, useEffect, useRef } from "react";

const INITIAL_SCALE_ANIMATION = .8
export const ModalContainer: React.FC<{
    setHeight: (height: number | string) => void;
    active: boolean;
    height: number | string;
    children: ReactElement;
}> = ({ active, setHeight, height, children }) => {
    const screenSize = useScreenSizes();
    const ref = useRef<HTMLDivElement>(null);
    
    const updateHeight = () => {
        if(!active || !ref.current) return;
        const { height } = ref.current?.getBoundingClientRect();
        setHeight(height);
    }
    useEffect(() => {
        if(screenSize === 'phone') {
            setHeight('100dvh');
            return;
        }

        // After scale animation, observe for height changes
        const timeout = setTimeout(() => {
            if(!ref.current) return;
            new ResizeObserver(updateHeight).observe(ref.current);
        }, 400);

        return () => clearTimeout(timeout);
    }, [screenSize]);
    useEffect(() => {
        if(!ref.current) return;
        if(typeof height === 'string') return;

        // If is initial modal, calculate
        if(!height) {
            const { height: elementHeight } = ref.current.getBoundingClientRect();
            setHeight(elementHeight / INITIAL_SCALE_ANIMATION);
            return;
        }

        updateHeight();
    }, [active]);

    return(
        <motion.div
            className={active ? styles['active'] : ''}
            ref={ref}
        >
            {children}
        </motion.div>
    )
}