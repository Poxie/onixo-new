import styles from './CheckmarkSpinner.module.scss';

export const CheckmarkSpinner: React.FC<{
    completed: boolean;
    errored: boolean;
}> = ({ completed, errored }) => {
    const className = [
        styles['circle-loader'],
        completed ? styles['load-complete'] : '',
        errored ? styles['load-errored'] : ''
    ].join(' ');
    return(
        <div className={className}>
            <div className={`${styles['checkmark']} ${styles["draw"]}`}></div>
            <div className={`${styles['error']} ${styles["draw"]}`}></div>
        </div>
    )
}