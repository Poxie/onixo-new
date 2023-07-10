import { CheckmarkIcon } from '@/assets/icons/CheckmarkIcon';
import styles from './Premium.module.scss';
import plans from '@/assets/json/PremiumPlans.json';
import Button from '../button';
import { useRouter } from 'next/router';

export const PremiumPlan: React.FC<typeof plans[0]> = ({ id, type, header, description, price, priceDescription, sale, isPopular, perks }) => {
    const pathname = useRouter().pathname;

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
            {pathname.includes('guildId') ? (
                <Button 
                    className={styles['button']}
                    type={'tertiary'}
                    customAttributes={{
                        'data-cb-type': 'checkout',
                        'data-cb-item-0': id,
                        'data-cb-item-0-quantity': '1'
                    }}
                >
                    Get {header} Plan
                </Button>
            ) : (
                <Button 
                    className={styles['button']}
                    type={'tertiary'}
                    href={`/dashboard?redirect=/premium?plan=${header.toLowerCase()}`}
                >
                    Get {header} Plan
                </Button>
            )}
        </div>
    )
}