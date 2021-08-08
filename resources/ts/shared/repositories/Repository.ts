import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ClassConstructor, ClassTransformOptions, plainToClass } from 'class-transformer';

import { PaginatedData } from '@shared/classes/PaginatedData';
import { Inject } from '@shared/decorators/Inject';
import { Injectable } from '@shared/decorators/Injectable';
import { APIService } from '@shared/services/APIService';

@Injectable()
export abstract class Repository<T> {
    protected abstract readonly endpointPath: string;
    protected abstract readonly model: ClassConstructor<T>;
    private _endpoint!: AxiosInstance;

    constructor(@Inject() private apiService: APIService) {}

    protected get endpoint() {
        if (!this._endpoint) {
            this._endpoint = this.apiService.createEndpoint(this.endpointPath);
        }
        return this._endpoint;
    }

    public async list<R>(config?: AxiosRequestConfig, transformModel?: ClassConstructor<R>): Promise<PaginatedData<R>> {
        let { data } = await this.endpoint.get('', config);
        if (!(data?.meta && data?.links && data?.data)) {
            data = { data };
        }
        data.data = this.toEntities(data.data, null, transformModel);
        return plainToClass(PaginatedData, data) as any;
    }

    public async listAll<R = T>(config?: AxiosRequestConfig, transformModel?: ClassConstructor<R>): Promise<R[]> {
        const { data } = await this.endpoint.get(
            '',
            this.apiService.mergeConfig(config, {
                params: { all: true },
            }),
        );

        return this.toEntities(data?.data || data, null, transformModel);
    }

    public async show<R = T, I = number>(
        resourceId: I,
        config?: AxiosRequestConfig,
        transformModel?: ClassConstructor<R>,
    ): Promise<R> {
        const { data } = await this.endpoint.get<R>(`/${resourceId}`, config);

        return this.toEntity(data, null, transformModel);
    }

    public async save<R = T, D = R>(
        requestData: D,
        config?: AxiosRequestConfig,
        transformModel?: ClassConstructor<R>,
    ): Promise<R> {
        const { data } = await this.endpoint.post<R>('', requestData, config);

        return this.toEntity(data, null, transformModel);
    }

    public async update<R = T, D = R, I = number>(
        resourceId: I,
        requestData: D,
        config?: AxiosRequestConfig,
        transformModel?: ClassConstructor<R>,
    ): Promise<R> {
        const { data } = await this.endpoint.put<R>(`/${resourceId}`, requestData, config);
        return this.toEntity(data, null, transformModel);
    }

    public async destroy<R = T, I = number>(
        resourceId: I,
        config?: AxiosRequestConfig,
        transformModel?: ClassConstructor<R>,
    ): Promise<R> {
        const { data } = await this.endpoint.delete<R>(`/${resourceId}`, config);
        return this.toEntity<R>(data, null, transformModel);
    }

    public toEntity<R = T>(
        data: R | any,
        options?: ClassTransformOptions | null,
        transformModel?: ClassConstructor<R>,
    ): R {
        return plainToClass((transformModel || this.model) as ClassConstructor<R>, data, options || {});
    }

    public toEntities<R = T>(
        data: R[] | any[],
        options?: ClassTransformOptions | null,
        transformModel?: ClassConstructor<R>,
    ): R[] {
        return plainToClass((transformModel || this.model) as ClassConstructor<R>, data, options || {});
    }
}
