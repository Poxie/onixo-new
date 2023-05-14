import Button from '../button';
import styles from './Home.module.scss';

export const Customize = () => {
    return(
        <section className={styles['customize']}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 202" fill="none">
                <path d="M513.279 85.9761C206.14 -5.04855 -0.523941 85.9761 -0.523941 85.9761L-0.523936 201.999L1920 202V0.662148C1920 207.162 1466 61 1150.41 85.9761C834.829 110.952 820.418 177.001 513.279 85.9761Z" fill="#101318"/>
            </svg>
            <div className={styles['customize-text']}>
                <h2>
                    All customizable on our dashboard
                </h2>
                <p>
                    After inviting Onixo, you will be able to customize your server settings on our dashboard. You will also be able to modify the commnads as you see fit.
                </p>
                <div className={styles['customize-buttons']}>
                    <Button 
                        type={'tertiary'}
                        href={'/dashboard'}
                    >
                        Go to Dashboard
                    </Button>
                    <Button 
                        type={'tertiary'} 
                        href={'/invite'}
                    >
                        Invite to Server
                    </Button>
                </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 202" fill="none">
                <path d="M513.279 85.9761C206.14 -5.04855 -0.523941 85.9761 -0.523941 85.9761L-0.523936 201.999L1920 202V0.662148C1920 207.162 1466 61 1150.41 85.9761C834.829 110.952 820.418 177.001 513.279 85.9761Z" fill="#101318"/>
            </svg>
        </section>
    )
}