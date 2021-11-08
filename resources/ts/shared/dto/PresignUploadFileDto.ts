export class PresignUploadFileDto {
    public fileName!: string;
    public size!: number;
    public contentType!: string;
    public prefix?: string;
    public suffix?: string;
}
