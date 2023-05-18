import Button from '@/components/button'
import styles from './ComingSoon.module.scss'
import { DashAuthLayout } from "@/layouts/dash-auth"
import { DashboardLayout } from "@/layouts/dashboard"
import { NextPageWithLayout } from "@/pages/_app"
import { useRouter } from 'next/router'

export const ComingSoon: NextPageWithLayout = () => {
    const router = useRouter();
    return(
        <div className={styles['container']}>
            <h1>
                THIS IS NOT A FEATURE... YET.
            </h1>
            <p>
                This feature is currently in development. Fear not; it will not take long!
            </p>
            <Button 
                type={'tertiary'}
                onClick={router.back}
            >
                Take me back!
            </Button>
        </div>
    )
}

ComingSoon.getLayout = page => (
    <DashAuthLayout>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </DashAuthLayout>
)