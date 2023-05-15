import styles from './ModuleHeader.module.scss';

export const ModuleHeader: React.FC<{
    header: string;
    subHeader: string;
}> = ({ header, subHeader }) => {
    return(
        <div className={styles['container']}>
            <h1>
                {header}
            </h1>
            <p>
                {subHeader}
            </p>
        </div>
    )
}