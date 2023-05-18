import styles from './Menu.module.scss';
import { MenuGroup as MenuGroupType } from "../contexts/menu/types"
import { MenuGroup } from "./MenuGroup";
import { useEffect, useRef, useState } from 'react';
import { useMenu } from '../contexts/menu';
import { motion } from 'framer-motion';

const SPACE_FROM_ELEMENT = 10;
export const Menu: React.FC<{
    groups: MenuGroupType[];
    dimensions: { top: number, left: number, width: number, height: number };
}> = ({ groups, dimensions }) => {
    const { close } = useMenu();
    const [position, setPosition] = useState({ left: 0, top: 0 });
    const ref = useRef<HTMLDivElement>(null);

    // Determining new position
    useEffect(() => {
        if(!ref.current) return;

        // Getting current element size
        const { width } = ref.current.getBoundingClientRect();

        // Calculating new position of element
        let top = dimensions.top + dimensions.height + SPACE_FROM_ELEMENT;
        let left = dimensions.left + dimensions.width - width;

        // Updating with new position
        setPosition({ top, left });
    }, [dimensions.top, dimensions.left]);
    
    // Handling click outside menu
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if(ref.current && !ref.current.contains(e.target as any)) {
                close();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [ref.current]);

    return(
        <motion.div 
            initial={{ opacity: 0, translateY: 10 }}
            exit={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: .25 }}
            className={styles['container']}
            style={{ left: position.left, top: position.top }}
            ref={ref}
        >
            {groups.map((group, key) => (
                <MenuGroup 
                    items={group}
                    key={key}
                />
            ))}
        </motion.div>
    )
}