import styles from './Home.module.scss';
import { ReactElement } from "react"

export const QuickAction: React.FC<{
    active: boolean;
    icon: ReactElement;
    text: string;
    onClick: () => void;
}> = ({ icon, text, onClick, active }) => {
    const className = [
        styles['action-item'],
        active ? styles['active'] : ''
    ].join(' ');
    return(
        <li>
            <button 
                className={className} 
                onClick={onClick}
            >
                {icon}
                <span>
                    {text}
                </span>
            </button>
        </li>
    )
}