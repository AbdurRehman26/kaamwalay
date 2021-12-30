import { AxiosRequestConfig } from 'axios';

export interface APIEndpointConfig<Data = any> extends AxiosRequestConfig<Data> {
    version?: string;
}
