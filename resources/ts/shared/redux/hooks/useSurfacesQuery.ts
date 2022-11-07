import { AxiosRequestConfig } from 'axios';
import { CardSurfaceEntity } from '@shared/entities/CardSurfaceEntity';
import { useListQuery } from '@shared/hooks/useListQuery';
import { listAdminSurfacesAction } from '../slices/adminSurfacesSlice';

export function useAdminSurfacesQuery(config: AxiosRequestConfig) {
    return useListQuery(listAdminSurfacesAction, CardSurfaceEntity, (state) => state.adminSurfaces, config);
}
