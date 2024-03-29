import { AxiosInstance } from 'axios';
import { useMemo } from 'react';
import { APIEndpointConfig } from '@shared/interfaces/APIEndpointConfig';
import { APIService } from '../services/APIService';
import { useInjectable } from './useInjectable';

export function useEndpoint(path: string, config?: APIEndpointConfig): AxiosInstance {
    const apiService = useInjectable(APIService);
    // eslint-disable-next-line robograding/api-service-create-endpoint
    return useMemo(() => apiService.createEndpoint(path, config), [apiService, path, config]);
}
