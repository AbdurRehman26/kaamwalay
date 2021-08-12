import { AxiosInstance, AxiosRequestConfig } from 'axios';
import objectHash from 'object-hash';
import { useMemo } from 'react';

import { APIService } from '@shared/services/APIService';

import { useInjectable } from './useInjectable';

export function useEndpoint(path: string, config?: AxiosRequestConfig): AxiosInstance {
    const apiService = useInjectable(APIService);
    return useMemo(() => apiService.createEndpoint(path, config), [path, config && objectHash(config)]);
}
