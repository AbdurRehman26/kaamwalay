import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Map } from 'immutable';

import { Injectable } from '@shared/decorators/Injectable';
import { Log4ts } from '@shared/decorators/Log4ts';
import { LogChannel } from '@shared/lib/log/LogChannel';

@Injectable({ name: 'APIService' })
export class APIService {
    @Log4ts() private log!: LogChannel;

    /**
     * Create an axios instance configured to send requests to /api/{path}
     * @example
     * ```
     * const api = resolve(APIService);
     * const users$ = api.createEndpoint('users');
     * ...
     * users$.get('').then(..);
     * ```
     * @param path
     * @param config
     */
    public createEndpoint(path: string, config?: AxiosRequestConfig) {
        const path$ = path.replace(/^\/?api/i, '').replace(/^\//g, '');

        return this.createAxios({
            ...config,
            baseURL: `/api/${path$}`,
        });
    }

    /**
     * Create an axios instance configured to send requests to /api/{path}
     * @example
     * ```
     * const api = resolve(APIService);
     * const users$ = api.createAxios({ baseURL: '/api/users' });
     * ...
     * users$.get('').then(...);
     * ```
     * @param config
     */
    private createAxios(config?: AxiosRequestConfig) {
        const instance = Axios.create(config);

        instance.interceptors.request.use(this.requestInterceptor.bind(this));
        instance.interceptors.response.use(
            this.responseInterceptor.bind(this),
            this.responseErrorInterceptor.bind(this),
        );

        return instance;
    }

    /**
     *
     * @param config
     * @private
     */
    private requestInterceptor(config: AxiosRequestConfig) {
        return config;
    }

    /**
     *
     * @param response
     * @private
     */
    private responseInterceptor(response: AxiosResponse) {
        if (response?.data?.data && Object.keys(response?.data).length === 1) {
            response.data = response.data.data;
        }

        return response;
    }

    /**
     *
     * @param error
     * @private
     */
    private responseErrorInterceptor(error: AxiosError) {
        error.response = this.responseInterceptor(error.response!);
        throw error;
    }

    mergeConfig(base?: AxiosRequestConfig, ...partial: (AxiosRequestConfig | undefined)[]) {
        const base$ = Map(base ?? {});

        return partial.reduce((target, partialConfig) => target.mergeDeep(Map(partialConfig ?? {})), base$).toJS();
    }
}
