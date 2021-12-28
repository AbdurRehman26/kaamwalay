import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ClassConstructor, ClassTransformOptions, plainToClass } from 'class-transformer';
import { PaginatedData } from '../classes/PaginatedData';
import { Injectable } from '../decorators/Injectable';
import { app } from '../lib/app';
import { APIService } from '../services/APIService';
import { APIEndpointConfig } from '../interfaces/APIEndpointConfig';

@Injectable('Repository')
export abstract class Repository<T> {
    protected abstract readonly model: ClassConstructor<T>;
    protected abstract readonly endpointPath: string;
    protected readonly endpointConfig: APIEndpointConfig = {};

    protected readonly apiService: APIService;
    private _endpoint!: AxiosInstance;

    constructor() {
        this.apiService = app(APIService);
    }

    protected get endpoint() {
        if (!this._endpoint) {
            this._endpoint = this.apiService.createEndpoint(this.endpointPath, this.endpointConfig);
        }
        return this._endpoint;
    }

    public static callMethod<T extends Repository<any>, K extends keyof T>(
        repository: T,
        method: K,
        ...args: T[K] extends (...args: infer P) => any ? P : never
    ) {
        if (typeof repository[method] === 'function') {
            return (repository[method] as any)(...(args ?? []));
        } else {
            throw new Error(`Undefined method '${method}' on repository '${(repository as any)?.name || 'Unknown'}'`);
        }
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

    public async list<R = T>(
        config?: AxiosRequestConfig,
        transformModel?: ClassConstructor<R>,
    ): Promise<PaginatedData<R>> {
        let { data } = await this.endpoint.get('', config);
        if (!(data?.meta && data?.links && data?.data)) {
            data = { data: data };
        }

        return PaginatedData.from(this.toEntities(data.data, null, transformModel), data.links, data.meta) as any;
    }
}
