import { CheckmarkIcon } from '@/assets/icons/CheckmarkIcon';
import styles from './Premium.module.scss';
import plans from '@/assets/json/PremiumPlans.json';
import Button from '../button';
import { useGuildId } from '@/hooks/useGuildId';
import { useAuth } from '@/contexts/auth';
import { HostedPage } from '@/types';
import { useEffect } from 'react';

export const PremiumPlan: React.FC<typeof plans[0]> = ({ id, type, header, description, price, priceDescription, sale, isPopular, perks }) => {
    const { post } = useAuth();
    const guildId = useGuildId();

    const fetchCheckoutUrl = async () => {
        // Attempt to open checkout modal
        try {
            const chargebeeInstance = (window as any).Chargebee.getInstance();
            
            chargebeeInstance.openCheckout({
                hostedPage: async function() {
                    const page = await post<HostedPage>(`/guilds/${guildId}/subscriptions/url`, { plan_id: id })
                    return page;
                }
            })
        } catch(error: any) {
            // If instance is not yet initialized, initialize it and attempt again
            if(error.message.includes('Instance not created')) {
                (window as any).Chargebee?.init({
                    site: process.env.NEXT_PUBLIC_CHARGEBEE_SITE,
                    domain: process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_FRONTEND_ORIGIN : undefined,
                    iframeOnly: true
                });
                fetchCheckoutUrl();
                return;
            }
            console.error(error);
        }
    }

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
                        ${price}
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
            {guildId ? (
                <Button 
                    className={styles['button']}
                    type={'tertiary'}
                    onClick={fetchCheckoutUrl}
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