import { Injectable } from '../decorators/Injectable';
import { ConfigurationEntity } from '../entities/ConfigurationEntity';
import { Repository } from './Repository';

@Injectable('ConfigurationRepository')
export class ConfigurationsRepository extends Repository<ConfigurationEntity> {
    readonly endpointPath: string = 'configurations';
    readonly model = ConfigurationEntity;

    public async getConfigurations() {
        const { data } = await this.endpoint.get('');
        return this.toEntity(data);
    }
}
