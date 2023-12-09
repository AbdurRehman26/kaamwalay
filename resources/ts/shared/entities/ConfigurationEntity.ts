export class ConfigurationEntity {
    public appEnv!: string;
    public appUrl!: string;
    public meilisearchPublicHost!: string;
    public meilisearchPublicKey!: string;
    public stripeKey!: string;
    public googleAnalyticsTrackingCode!: string;
    public collectorCoinDiscountPercentage!: string;
    public web3SupportedNetworks!: string;
    public web3BscWallet!: string;
    public web3EthWallet!: string;
    public web3TestWallet!: string;
    public searchCardCategoriesCustomer!: string;
    public searchCardCategoriesAdmin!: string;
    public featureOrderWalletCreditEnabled!: boolean;
    public featureOrderWalletCreditPercentage!: number;
    public featureReferralDiscountPercentage!: number;
    public featureOrderCleaningFeePerCard!: number;
    public featureOrderCleaningFeeMaxCap!: number;
    public featureOrderShippingInsuranceFeePercentage!: number;
    public featureReferralMaxDiscountItems!: number;
    public featureOrderPaymentAffirmMinAmount!: number;
    public featureOrderSignatureAtDeliveryFeeValue!: number;
}
