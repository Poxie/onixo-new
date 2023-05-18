import styles from './Menu.module.scss';
import { MenuItem as MenuItemType } from "../contexts/menu/types"
import { useMenu } from '@/contexts/menu';
import Link from 'next/link';

export const MenuItem: React.FC<MenuItemType> = ({ text, href, onClick, closeOnClick=true, type='default' }) => {
    const { close } = useMenu();

    const handleClick = () => {
        onClick && onClick();
        closeOnClick && close();
    }

    const className = [
        styles['item'],
        styles[type]
    ].join(' ');
    const props = {
        className,
        onClick: handleClick,
    }
    return(
        href ? (
            <Link href={href}>
                <a {...props}>
                    {text}
                </a>
            </Link>
        ) : (
            <button {...props}>
                {text}
            </button>
        )
    )
}