import { useEffect, useState } from "react"

const COMPUTER = 900;
const TABLET = 500;
const PHONE = 0;

const SIZES = ['computer', 'tablet', 'phone'];
type Size = 'computer' | 'tablet' | 'phone';

export const useScreenSizes = () => {
    const [size, setSize] = useState<Size>('computer');

    useEffect(() => {
        const onResize = () => {
            const width = window.innerWidth;
            if(width > COMPUTER) return setSize('computer');
            if(width > TABLET) return setSize('tablet');
            if(width > PHONE) return setSize('phone');
        }
        onResize();

        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    return size;
}