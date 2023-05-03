import { AxiosRequestConfig } from 'axios';
import { TaggableModelDto } from '@shared/dto/TaggableModelDto';
import { TaggableModelEntity } from '@shared/entities/TaggableModelEntity';
import { Injectable } from '../../decorators/Injectable';
import { Repository } from '../Repository';

@Injectable('TaggableModelRepository')
export class TaggableModelRepository extends Repository<TaggableModelEntity> {
    readonly endpointPath: string = '/admin/';
    readonly model = TaggableModelEntity;
    readonly endpointConfig = {
        version: 'v3',
    };

    public async attachTags(input?: TaggableModelDto, config?: AxiosRequestConfig): Promise<TaggableModelEntity> {
        const { data } = await this.endpoint.post('attach-tags', input, config);
        return this.toEntity(data);
    }

    public async detachTags(input?: TaggableModelDto, config?: AxiosRequestConfig): Promise<TaggableModelEntity> {
        const { data } = await this.endpoint.post('detach-tags', input, config);
        return this.toEntity(data);
    }
}
