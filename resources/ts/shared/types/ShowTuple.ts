import { AxiosRequestConfig } from 'axios';

import { ID } from './Id';

export type ShowTuple = [resourceId: ID, config?: AxiosRequestConfig];
