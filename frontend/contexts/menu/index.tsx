import { AnimatePresence } from 'framer-motion';
import React, { ReactElement, RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { Menu } from '@/menus/Menu';
import { Context, MenuGroup } from './types';

const MenuContext = React.createContext({} as Context);

export const useMenu = () => React.useContext(MenuContext);

export const MenuProvider: React.FC<{
    children: any;
}> = ({ children }) => {
    const [groups, setGroups] = useState<MenuGroup[]>([]);
    const [dimensions, setDimensions] = useState({ top: 0, left: 0, width: 0, height: 0 });
    const elementRef = useRef<HTMLElement | null>(null);

    // Getting ref dimensions
    const _setDimensions = useCallback(() => {
        if(!elementRef.current) return;
        const { left, top, width, height } = elementRef.current.getBoundingClientRect();
        setDimensions({ left, top, width, height });
    }, [elementRef.current]);

    // Setting menu
    const _setMenu = (menuGroups: MenuGroup[], ref: RefObject<HTMLElement>) => {
        if(!ref.current) return;

        // Setting menu groups
        setGroups(menuGroups);
        
        // Setting dimensions
        elementRef.current = ref.current;
        _setDimensions();
    }

    // Updating menu on resize and scroll
    useEffect(() => {
        if(!elementRef.current) return;

        window.addEventListener('resize', _setDimensions);
        window.addEventListener('scroll', _setDimensions);
        return () => {
            window.removeEventListener('resize', _setDimensions);
            window.removeEventListener('scroll', _setDimensions);
        }
    }, [elementRef.current]);

    // Closing menu
    const close = () => {
        setGroups([]);
    }

    const value = {
        setMenu: _setMenu,
        close
    }
    return(
        <MenuContext.Provider value={value}>
            {children}

            <AnimatePresence>
                {groups.length !== 0 && (
                    <Menu 
                        groups={groups}
                        dimensions={dimensions}
                    />
                )}
            </AnimatePresence>
        </MenuContext.Provider>
    )
}