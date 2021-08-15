import { AxiosRequestConfig } from 'axios';
import { ID } from './Id';

export type ThunkShowActionArg = {
    resourceId: ID;
    config?: AxiosRequestConfig;
};
