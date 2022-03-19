import { AxiosRequestConfig } from 'axios';
import { ExportDataDTO } from '@shared/dto/ExportDataDTO';
import { ExportDataEntity } from '@shared/entities/ExportDataEntity';
import { Injectable } from '../../decorators/Injectable';
import { Repository } from '../Repository';

@Injectable('DataExportRepository')
export class DataExportRepository extends Repository<ExportDataEntity> {
    readonly endpointPath: string = '/admin/export-data';
    readonly model = ExportDataEntity;

    public async export(input?: ExportDataDTO, config?: AxiosRequestConfig): Promise<ExportDataEntity> {
        const { data } = await this.endpoint.post('', input, config);
        return this.toEntity(data);
    }
}
