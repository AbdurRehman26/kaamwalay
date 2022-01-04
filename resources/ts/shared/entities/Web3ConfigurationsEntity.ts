import { Entity } from '@shared/entities/Entity';

export class Web3ConfigurationsEntity extends Entity {
    public supportedNetworks!: string[];
    public bscWallet!: string;
    public ethWallet!: string;
    public testWallet!: string;
}
