import { ReactElement, useEffect, useRef } from "react";
import { TooltipPosition, useTooltip } from ".";

export const HasTooltip: React.FC<{
    tooltip: string;
    children: ReactElement;
    className?: string;
    position?: TooltipPosition;
    onClick?: () => void;
    delay?: number;
}> = ({ children, className, onClick, tooltip, position='top', delay=0 }) => {
    const { setTooltip, close } = useTooltip();
    const ref = useRef<any>(null);
    const timeout = useRef<NodeJS.Timeout | null>(null);

    const onMouseEnter = () => {
        timeout.current = setTimeout(() => {
            setTooltip({ tooltip, position }, ref);
        }, delay);
    }
    const onMouseLeave = () => {
        if(timeout.current) {
            clearTimeout(timeout.current);
            timeout.current = null;
        }
        close();
    }
    const handleClick = () => {
        if(onClick) onClick();
        close();
    }

    // Closing and cancelling on unmount
    useEffect(() => {
        return () => {
            if(timeout.current) clearTimeout(timeout.current);
            close();
        }
    }, []);

    const props = {
        className,
        onMouseEnter,
        onMouseLeave,
        onClick: handleClick,
        ariaLabel: tooltip,
        ref
    }

    return(
        onClick ? (
            <button {...props}>
                {children}
            </button>
        ) : (
            <div {...props}>
                {children}
            </div>
        )
    )
}