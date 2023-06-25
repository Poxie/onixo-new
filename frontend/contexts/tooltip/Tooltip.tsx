import { motion } from 'framer-motion';
import { ReactElement, RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './Tooltip.module.scss';
import { TooltipPosition } from '.';

const SPACE_FROM_ORIGIN = 10;
const SPACE_FROM_EDGE = 30;
const ANIMATION_SPACING = 0;
const TRANSITION_DURATION = .11;
export const Tooltip: React.FC<{
    children: ReactElement | string;
    position: TooltipPosition;
    refElement: RefObject<HTMLDivElement>;
}> = ({ children, position, refElement }) => {
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const [tooltipOffset, setTooltipOffset] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if(!ref.current || !refElement.current) return;
        
        // Getting dimensions
        let { left, top, width: refWidth, height: refHeight } = refElement.current.getBoundingClientRect();
        let { width, height } = ref.current.getBoundingClientRect();

        // Getting preliminary position
        switch(position) {
            case 'top':
                top -= (height + SPACE_FROM_ORIGIN)
                left = left - width / 2 + refWidth / 2;
                break;
            case 'bottom':
                top += refHeight + SPACE_FROM_ORIGIN
                left = left - width / 2 + refWidth / 2;
                break;
            case 'left':
                top += refHeight / 2 - height / 2;
                left -= width + SPACE_FROM_ORIGIN
                break;
            case 'right':
                top += refHeight / 2 - height / 2;
                left += refWidth + SPACE_FROM_ORIGIN
                break;
        }

        // Checking if position exceeds viewport
        let offset = 0;
        if(left + width > window.innerWidth - SPACE_FROM_EDGE) {
            const newLeft = window.innerWidth - width - SPACE_FROM_EDGE;
            offset = left - newLeft;
            left = newLeft
        }
        if(left < 0) {
            offset = left - SPACE_FROM_EDGE;
            left = SPACE_FROM_EDGE;
        }

        setTooltipOffset(offset);
        setTooltipPosition({ top, left });
    }, [refElement.current]);

    const translateY = ['bottom', 'top'].includes(position) ? ANIMATION_SPACING : 0;
    const translateX = ['left', 'right'].includes(position) ? ANIMATION_SPACING : 0;
    return(
        <motion.div 
            initial={{ 
                opacity: 0, 
                translateY: position === 'top' ? -translateY : translateY 
            }}
            exit={{ 
                opacity: 0, 
                translateX: position === 'left' ? -translateX : translateX 
            }}
            animate={{ 
                opacity: 1, 
                translateY: 0, 
                translateX: 0,
            }}
            transition={{ duration: TRANSITION_DURATION }}
            className={styles['container']}
            style={{...tooltipPosition, ...{
                '--tooltip-offset': `${tooltipOffset}px`
            }}}
            data-position={position}
            ref={ref}
        >
            {children}
        </motion.div>
    )
}