import styles from './ModuleSubsection.module.scss';

export const ModuleSubsection: React.FC<{
    header: string;
    subHeader?: string;
    className?: string;
    children: any;
}> = ({ header, subHeader, className, children }) => {
    return(
        <div>
            <div className={styles['header-container']}>
                <span className={styles['header']}>
                    {header}
                </span>
                <span className={styles['subheader']}>
                    {subHeader}
                </span>
            </div>
            {children}
        </div>
    )
}