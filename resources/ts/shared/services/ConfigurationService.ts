import { Injectable } from '@shared/decorators/Injectable';
import { ConfigurationEntity } from '../entities/ConfigurationEntity';
import { loadConfigurationsAction, setConfig } from '../redux/slices/configurationSlice';
import { getGlobalStore, GlobalStoreType } from '../redux/store';

@Injectable('ConfigurationService')
export class ConfigurationService {
    private config = new ConfigurationEntity();
    private store: GlobalStoreType;

    constructor() {
        this.store = getGlobalStore();

        this.store.subscribe(() => {
            this.config = this.store.getState()?.configuration?.data ?? {};
        });
    }

    public async load() {
        await this.store.dispatch(loadConfigurationsAction());
    }

    public get<K extends keyof ConfigurationEntity>(key: K): ConfigurationEntity[K] {
        return this.config[key];
    }

    public set<K extends keyof ConfigurationEntity>(key: K, value: ConfigurationEntity[K]): void {
        this.store.dispatch(setConfig({ key, value }));
    }
}
