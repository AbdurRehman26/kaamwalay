import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Map } from 'immutable';
import { Inject } from '../decorators/Inject';
import { Injectable } from '../decorators/Injectable';
import { buildUrl } from '../lib/api/buildUrl';
import { cleanPath } from '../lib/strings/cleanPath';
import { fromApiPropertiesObject } from '../lib/utils/fromApiPropertiesObject';
import { toApiPropertiesObject } from '../lib/utils/toApiPropertiesObject';
import { AuthenticationService } from './AuthenticationService';

@Injectable('APIService')
export class APIService {
    constructor(@Inject() private authenticationService: AuthenticationService) {}

    public attach() {
        Axios.interceptors.request.use(this.requestInterceptor.bind(this));
        Axios.interceptors.response.use(this.responseInterceptor.bind(this), this.responseErrorInterceptor.bind(this));
    }

    /**
     * Create an axios instance configured to send requests to /api/{path}
     * @example
     * ```
     * const api = app(APIService);
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
     * const api = app(APIService);
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

        config.url = buildUrl(config.url ?? '', config?.params ?? {});
        config.baseURL = buildUrl(config.baseURL ?? '', config?.params ?? {});

        config.params = this.objectToSnakeCase(config.params);
        config.data = this.objectToSnakeCase(config.data);

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

        response.data = this.objectToCamelCase(response.data);

        if (process.env.NODE_ENV === 'development') {
            this.logResponse(response);
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

    public async download(url: string, filename?: string, config?: AxiosRequestConfig) {
        const { data } = await Axios.get(
            url,
            this.mergeConfig(config, {
                responseType: 'blob',
            }),
        );

        const downloadHref = URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = downloadHref;
        link.download = filename ?? '';
        link.target = '_blank';
        link.rel = 'noopener';
        link.click();
        link.remove();

        URL.revokeObjectURL(downloadHref);
    }

    private objectToSnakeCase(data: any) {
        return toApiPropertiesObject(data, { deep: true });
    }

    private objectToCamelCase(data: any) {
        return fromApiPropertiesObject(data, { deep: true });
    }

    private logResponse(response: AxiosResponse) {
        try {
            const url = cleanPath(`${response.config.baseURL}/${response.config.url}`);
            console.groupCollapsed(`HTTP Request: ${response.config.method?.toUpperCase()} ${url}`);
            console.log(response);
            console.groupEnd();
        } catch (e) {
            // pass
        }
    }

    private canBeConverted(data: any) {
        return data && typeof data === 'object';
    }
}
