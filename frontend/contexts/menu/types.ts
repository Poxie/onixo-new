import { RefObject } from "react";

export type Context = {
    setMenu: (menuGroups: MenuGroup[], ref: RefObject<HTMLElement>) => void;
    close: () => void;
}

export type MenuItem = {
    text: string;
    href?: string;
    onClick?: () => void;
    closeOnClick?: boolean;
    type?: 'default' | 'danger';
    disabled?: boolean;
    active?: boolean;
    icon?: any;
}
export type MenuGroup = MenuItem[];