import { useRouter } from 'next/router';
import styles from './Auth.module.scss';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/auth';

export const Auth = () => {
    const router = useRouter();
    const { code } = router.query;
    const { setToken } = useAuth();
    
    useEffect(() => {
        if(!code) return;

        fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth`, {
            method: 'POST',
            body: JSON.stringify({ code }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(response => {
            const { access_token, refresh_token } = response;
            
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);

            setToken(access_token);
            router.replace('/dashboard');
        })
    }, [code]);

    return(
        <div className={styles['container']}>
            <h1>
                Logging you in...
            </h1>
        </div>
    )
}