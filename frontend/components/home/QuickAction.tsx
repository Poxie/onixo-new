import styles from './Home.module.scss';
import { ReactElement } from "react"

export const QuickAction: React.FC<{
    icon: ReactElement;
    text: string;
}> = ({ icon, text }) => {
    return(
        <li className={styles['action-item']}>
            {icon}
            <span>
                {text}
            </span>
        </li>
    )
}