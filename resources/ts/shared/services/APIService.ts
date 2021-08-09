import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Map } from 'immutable';

import { Inject } from '@shared/decorators/Inject';
import { Injectable } from '@shared/decorators/Injectable';
import { AuthenticationService } from '@shared/services/AuthenticationService';

@Injectable({ name: 'APIService' })
export class APIService {
    constructor(@Inject() private authenticationService: AuthenticationService) {}

    /**
     * Create an axios instance configured to send requests to /api/{path}
     * @example
     * ```
     * const api = resolveInjectable(APIService);
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
     * const api = resolveInjectable(APIService);
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
    private async requestInterceptor(config: AxiosRequestConfig) {
        const accessToken = await this.authenticationService.getAccessToken();
        if (this.isNotExternal(config) && accessToken && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

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

        const message = error.response?.data?.message || error.response?.data?.error;
        if (message) {
            error.message = message;
        }

        throw error;
    }

    public mergeConfig(base?: AxiosRequestConfig, ...partial: (AxiosRequestConfig | undefined)[]) {
        const base$ = Map(base ?? {});

        return partial.reduce((target, partialConfig) => target.mergeDeep(Map(partialConfig ?? {})), base$).toJS();
    }

    private isNotExternal(config: AxiosRequestConfig): boolean {
        const baseURL = config.baseURL || '';
        return baseURL.startsWith('/') || baseURL.startsWith(window.location.origin);
    }
}
