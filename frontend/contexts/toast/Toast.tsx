import { motion } from 'framer-motion';
import { Toast as ToastType } from "./types";
import styles from './Toast.module.scss';
import { CSSProperties } from "react";

export const Toast: React.FC<ToastType> = ({ text, duration, type }) => {
    return(
        <motion.div 
            className={`${styles['item']} ${styles[type]}`}
            style={{ '--duration': `${duration}ms` } as CSSProperties}
            initial={{ left: `calc(100% + var(--spacing-primary) * 2)` }}
            exit={{ left: `calc(100% + var(--spacing-primary) * 2)` }}
            animate={{ left: 0 }}
            transition={{ duration: .4 }}
        >
            {text}
        </motion.div>
    )
}