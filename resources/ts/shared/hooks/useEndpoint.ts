import { AxiosInstance } from 'axios';
import { useMemo } from 'react';
import { APIService } from '../services/APIService';
import { useInjectable } from './useInjectable';
import { APIEndpointConfig } from '@shared/interfaces/APIEndpointConfig';

export function useEndpoint(path: string, config?: APIEndpointConfig): AxiosInstance {
    const apiService = useInjectable(APIService);
    // eslint-disable-next-line robograding/api-service-create-endpoint
    return useMemo(() => apiService.createEndpoint(path, config), [apiService, path, config]);
}
