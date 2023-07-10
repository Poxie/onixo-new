import { CheckmarkIcon } from '@/assets/icons/CheckmarkIcon';
import styles from './Premium.module.scss';
import plans from '@/assets/json/PremiumPlans.json';
import Button from '../button';

export const PremiumPlan: React.FC<typeof plans[0]> = ({ id, type, header, description, price, priceDescription, sale, isPopular, perks }) => {
    const className = [
        styles['plan'],
        isPopular ? styles['popular'] : ''
    ].join(' ');
    return(
        <div className={className}>
            <div className={styles['header']}>
                <span>
                    {header}
                </span>
                <p>
                    {description}
                </p>
            </div>
            <div className={styles['price-section']}>
                <div className={styles['price']}>
                    <span className={styles['price-text']}>
                        {price}$
                    </span>
                    <span className={styles['price-description']}>
                        {priceDescription}
                    </span>
                </div>
                <div className={styles['sale']}>
                    Save {sale}%
                </div>
            </div>
            <div className={styles['perks']}>
                {perks.map((perk, key) => (
                    <div 
                        className={styles['perk']} 
                        key={key}
                    >
                        <CheckmarkIcon />
                        {perk}
                    </div>
                ))}
            </div>
            <Button 
                className={styles['button']}
                type={'tertiary'}
                customAttributes={{
                    'href': 'javascript:void(0)',
                    'data-cb-type': 'checkout',
                    'data-cb-item-0': id,
                    'data-cb-item-0-quantity': '1'
                }}
            >
                Get {header} Plan
            </Button>
        </div>
    )
}