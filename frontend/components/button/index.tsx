import Link from 'next/link';
import React, { AnchorHTMLAttributes, ReactElement } from 'react';
import styles from './Button.module.scss';

type ButtonProps = {
    children?: any;
    buttonType?: 'button' | 'submit';
    type?: 'primary' | 'secondary' | 'tertiary' | 'hollow' | 'transparent';
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
    href?: string;
    ariaLabel?: string;
    target?: AnchorHTMLAttributes<''>['target'];
    disabled?: boolean;
    external?: boolean;
    icon?: ReactElement;
    customAttributes?: Object;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ children, style, onClick, href, ariaLabel, target, icon, customAttributes={}, buttonType='button', external=false, disabled=false, className='', type='primary' }, ref) => {
    className = [
        className,
        styles['container'],
        styles[type],
        disabled ? styles['disabled'] : ''
    ].join(' ');

    const props = {
        className,
        style,
        onClick,
        disabled,
        'aria-label': ariaLabel,
        ref: ref as any,
        ...customAttributes
    }

    return href ? (
        external ? (
            <a 
                href={href}
                rel={'noreferrer'}
                target={target}
                {...props}
            >
                {icon}
                {children}
            </a>
        ) : (
            <Link target={target} href={href} {...props}>
                {icon}
                {children}
            </Link>
        )
    ) : (
        <button 
            type={buttonType}
            {...props}
        >
            {icon}
            {children}
        </button>
    )
});
Button.displayName = 'Button';

export default Button;