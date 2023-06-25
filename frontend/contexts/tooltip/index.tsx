import React, { ReactElement, RefObject, useRef, useState } from "react"
import { AnimatePresence } from "framer-motion";
import { Tooltip } from "./Tooltip";
import { useScreenSizes } from "@/hooks/useScreenSizes";

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
export type Context = {
    setTooltip: (options: {
        tooltip: ReactElement | string;
        position?: TooltipPosition;
    }, ref: RefObject<HTMLDivElement>) => void;
    close: () => void;
}

const TooltipContext = React.createContext({} as Context);

export const useTooltip = () => React.useContext(TooltipContext);

export const TooltipProvider: React.FC<{
    children: ReactElement;
}> = ({ children }) => {
    const screenSize = useScreenSizes();

    const [tooltip, setTooltip] = useState<string | ReactElement | null>(null);
    const [position, setPosition] = useState<TooltipPosition>('top');
    const refElement = useRef<HTMLDivElement | null>(null);

    const _setTooltip: Context['setTooltip'] = (options, ref) => {
        const { tooltip, position='top' } = options;

        // Setting tooltip values
        setTooltip(tooltip);
        setPosition(position);
        refElement.current = ref.current;
    }

    const close = () => {
        setTooltip(null);
        setPosition('top');
        refElement.current = null;
    }

    const value = {
        setTooltip: _setTooltip,
        close
    }
    return(
        <TooltipContext.Provider value={value}>
            {children}

            <AnimatePresence>
                {screenSize === 'computer' && tooltip && (
                    <Tooltip
                        position={position}
                        refElement={refElement}
                    >
                        {tooltip}
                    </Tooltip>
                )}
            </AnimatePresence>
        </TooltipContext.Provider>
    )
}