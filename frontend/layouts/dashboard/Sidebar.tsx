import styles from './DashboardLayout.module.scss';
import { SidebarDropdown } from './SidebarDropdown';
import { SidebarTabs } from './SidebarTabs';

export const Sidebar = () => {
    return(
        <div className={styles['sidebar']}>
            <SidebarDropdown />
            <SidebarTabs />
        </div>
    )
}