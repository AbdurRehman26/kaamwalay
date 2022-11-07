import { plainToInstance } from 'class-transformer';
import { Injectable } from '@shared/decorators/Injectable';
import { CardSurfaceEntity } from '@shared/entities/CardSurfaceEntity';
import { Repository } from '@shared/repositories/Repository';

@Injectable('AdminSurfacesRepositary')
export class SurfacesRepositary extends Repository<CardSurfaceEntity> {
    readonly endpointPath: string = 'admin/cards/surfaces';
    readonly model = CardSurfaceEntity;

    async getRarity(surfaceId: any): Promise<CardSurfaceEntity> {
        const { data } = await this.endpoint.get<CardSurfaceEntity>(`${surfaceId}`);
        return plainToInstance(CardSurfaceEntity, data);
    }
}
