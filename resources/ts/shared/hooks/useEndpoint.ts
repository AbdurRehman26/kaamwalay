import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { useMemo } from 'react';
import { APIService } from '@shared/services/APIService';
import { useInjectable } from './useInjectable';

export function useEndpoint(path: string, config?: AxiosRequestConfig): AxiosInstance {
    const apiService = useInjectable(APIService);
    return useMemo(() => apiService.createEndpoint(path, config), [apiService, path, config]);
}
