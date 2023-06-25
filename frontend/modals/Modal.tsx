import { motion } from 'framer-motion';
import styles from './Modal.module.scss';

const INITIAL_SCALE_ANIMATION = .8
export const Modal: React.FC<{
    children: any;
    activeIndex: number;
    height: number | string;
}> = ({ children, activeIndex, height }) => {
    return(
        <motion.div 
            className={styles['container']}
            style={{ height: typeof height === 'string' ? height : `${height}px` }}
            initial={{ scale: INITIAL_SCALE_ANIMATION, opacity: 0, translateX: '-50%', translateY: '-50%' }}
            animate={{ scale: 1, opacity: 1, translateX: '-50%', translateY: '-50%' }}
            exit={{ scale: INITIAL_SCALE_ANIMATION, opacity: 0, translateX: '-50%', translateY: '-50%' }}
            transition={{ duration: .3 }}
        >
            <div 
                className={styles['content']}
                style={{ transform: `translateX(-${100 * activeIndex}%)` }}
            >
                {children}
            </div>
        </motion.div>
    )
}