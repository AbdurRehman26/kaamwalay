import { Injectable } from '../decorators/Injectable';
import { UploadFileEntity } from '../entities/UploadFileEntity';
import { Repository } from './Repository';
import { PresignUploadFileDto } from '@shared/dto/PresignUploadFileDto';
import axios from 'axios';

@Injectable('FilesRepository')
export class FilesRepository extends Repository<UploadFileEntity> {
    readonly endpointPath: string = 'files';
    readonly model = UploadFileEntity;

    public async uploadFile(file: File, input?: Partial<PresignUploadFileDto>): Promise<string> {
        return this.uploadBlob(file, {
            ...input,
            fileName: (file instanceof File ? file.name : input?.fileName) ?? '',
        });
    }

    public async uploadBlob(
        file: Blob,
        input?: Partial<PresignUploadFileDto> & Pick<PresignUploadFileDto, 'fileName'>,
    ): Promise<string> {
        const data = await this.presignUploadFile({
            fileName: input?.fileName ?? '',
            contentType: input?.contentType ?? file.type,
            size: input?.size ?? file.size,
            prefix: input?.prefix ?? '',
            directory: input?.directory ?? '',
            suffix: input?.suffix ?? '',
        });

        await axios.put(data.signedUrl, file, {
            headers: {
                'Content-Type': data.contentType,
            },
        });

        return data.publicUrl;
    }

    private async presignUploadFile(input: PresignUploadFileDto): Promise<UploadFileEntity> {
        const { data } = await this.endpoint.post('presign', input);
        return this.toEntity(data);
    }
}
