import styles from './ModuleSubsection.module.scss';

export const ModuleSubsection: React.FC<{
    header?: string;
    subHeader?: string;
    className?: string;
    children: any;
}> = ({ header, subHeader, className, children }) => {
    return(
        <div>
            {(header || subHeader) && (
                <div className={styles['header-container']}>
                    {header && (
                        <span className={styles['header']}>
                            {header}
                        </span>
                    )}
                    {subHeader && (
                        <span className={styles['subheader']}>
                            {subHeader}
                        </span>
                    )}
                </div>
            )}
            <div className={className}>
                {children}
            </div>
        </div>
    )
}