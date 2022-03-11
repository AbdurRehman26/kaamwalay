import { Injectable } from '../../decorators/Injectable';
import { Repository } from '../Repository';
import { ExportDataEntity } from '@shared/entities/ExportDataEntity';
import { ExportDataDTO } from '@shared/dto/ExportDataDTO';

@Injectable('DataExportRepository')
export class DataExportRepository extends Repository<ExportDataEntity> {
    readonly endpointPath: string = '/admin/export-data';
    readonly model = ExportDataEntity;

    public async export(input?: ExportDataDTO): Promise<ExportDataEntity> {
        const { data } = await this.endpoint.post('', input);
        return this.toEntity(data);
    }
}
