import { RefObject, useEffect, useState } from "react";

const DEFAULT_OFFSET = 300;
export const useWithinView = (ref: RefObject<HTMLElement>, offset: number=DEFAULT_OFFSET) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            if(!ref.current) return;

            const top = ref.current?.getBoundingClientRect().top;
            const scrollY = window.scrollY;

            const visible = (top - window.innerHeight + DEFAULT_OFFSET) < 0;
            
            if(visible) setVisible(true);
        }

        document.addEventListener('scroll', onScroll);
        return () => document.removeEventListener('scroll', onScroll);
    }, []);

    return visible;
}