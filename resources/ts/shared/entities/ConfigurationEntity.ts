import { Type } from 'class-transformer';
import { Web3ConfigurationsEntity } from '@shared/entities/Web3ConfigurationsEntity';

export class ConfigurationEntity {
    public appEnv!: string;
    public appUrl!: string;
    public algoliaAppId!: string;
    public algoliaPublicKey!: string;
    public stripeKey!: string;
    public googleAnalyticsTrackingCode!: string;
    public collectorCoinDiscountPercentage!: string;

    @Type(() => Web3ConfigurationsEntity)
    public web3Configurations!: Web3ConfigurationsEntity;
}
