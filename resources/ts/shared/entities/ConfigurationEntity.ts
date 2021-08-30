import { Field } from '../decorators/Field';

export class ConfigurationEntity {
    @Field('app_env')
    public appEnv!: string;

    @Field('app_url')
    public appUrl!: string;

    @Field('algolia_app_id')
    public algoliaAppId!: string;

    @Field('algolia_public_key')
    public algoliaPublicKey!: string;

    @Field('stripe_key')
    public stripeKey!: string;

    @Field('google_analytics_tracking_code')
    public googleAnalyticsTrackingCode!: string;
}
