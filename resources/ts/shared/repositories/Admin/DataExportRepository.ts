import { AxiosRequestConfig } from 'axios';
import { ExportDataDto } from '@shared/dto/ExportDataDto';
import { ExportDataEntity } from '@shared/entities/ExportDataEntity';
import { Injectable } from '../../decorators/Injectable';
import { Repository } from '../Repository';

@Injectable('DataExportRepository')
export class DataExportRepository extends Repository<ExportDataEntity> {
    readonly endpointPath: string = '/admin/export-data';
    readonly model = ExportDataEntity;
    readonly endpointConfig = {
        version: 'v2',
    };

    public async export(input?: ExportDataDto, config?: AxiosRequestConfig): Promise<ExportDataEntity> {
        const { data } = await this.endpoint.post('', input, config);
        return this.toEntity(data);
    }
}
