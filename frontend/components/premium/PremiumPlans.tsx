import styles from './Premium.module.scss';
import plans from '@/assets/json/PremiumPlans.json';
import { PremiumPlan } from './PremiumPlan';

export const PremiumPlans = () => {
    return(
        <div className={styles['plans']}>
            {plans.map(plan => (
                <PremiumPlan 
                    {...plan}
                    key={plan.type}
                />
            ))}
        </div>
    )
}