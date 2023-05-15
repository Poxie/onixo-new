import styles from './DashboardLayout.module.scss';
import { ReactElement } from "react"
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const DashboardLayout: React.FC<{
    children: ReactElement | ReactElement[];
}> = ({ children }) => {
    return(
        <div className={styles['dashboard']}>
            <Navbar />
            <div className={styles['main']}>
                <Sidebar />
                <main className={styles['dash-content']}>
                    {children}
                </main>
            </div>
        </div>
    )
}