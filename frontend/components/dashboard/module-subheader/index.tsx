import styles from './ModuleSubheader.module.scss';

export const ModuleSubheader: React.FC<{
    children: any;
    className?: string;
}> = ({ children, className }) => {
    className = [
        styles['text'],
        className
    ].join(' ');
    return(
        <p className={className}>
            {children}
        </p>
    )
}