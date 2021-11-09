export class UploadFileEntity {
    public size!: number;
    public fileName!: string;
    public contentType!: string;
    public prefix!: string;
    public suffix!: string;
    public publicUrl!: string;
    public key!: string;
    public signedUrl!: string;
}
