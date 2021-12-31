<?php

namespace App\Services\FileService;

use App\Http\Requests\API\V1\Files\PresignUploadRequest;

final class UploadFile
{
    protected string $signedUrl;
    protected string $publicUrl;
    protected string $key;

    public function __construct(
        protected string $fileName,
        protected string $contentType,
        protected int $size,
        protected string $prefix = '',
        protected string $suffix = '',
        protected string $directory = '',
        protected string $bucket = '',
    ) {
    }

    public static function fromRequest(PresignUploadRequest $request): UploadFile
    {
        $data = $request->validated();

        return new UploadFile(
            $data['file_name'],
            $data['content_type'],
            (int)$data['size'],
            $data['prefix'] ?? '',
            $data['suffix'] ?? '',
            $data['directory'] ?? '',
            $data['bucket'] ?? '',
        );
    }

    public function setSize(int $size): UploadFile
    {
        $this->size = $size;

        return $this;
    }

    public function getSize(): int
    {
        return $this->size;
    }

    public function getFileName(): string
    {
        return $this->fileName;
    }

    public function setFileName(string $fileName): UploadFile
    {
        $this->fileName = $fileName;

        return $this;
    }

    public function getContentType(): string
    {
        return $this->contentType;
    }

    public function setContentType(string $contentType): UploadFile
    {
        $this->contentType = $contentType;

        return $this;
    }

    public function getPrefix(string $default): string
    {
        if (! $this->prefix) {
            return $default;
        }

        return $this->prefix;
    }

    public function setPrefix(string $prefix): UploadFile
    {
        $this->prefix = $prefix;

        return $this;
    }

    public function getSuffix(string $default): string
    {
        if (! $this->suffix) {
            return  $default;
        }

        return $this->suffix;
    }

    public function setSuffix(string $suffix): UploadFile
    {
        $this->suffix = $suffix;

        return $this;
    }

    public function getPublicUrl(): string
    {
        return $this->publicUrl;
    }

    public function setPublicUrl(string $publicUrl): UploadFile
    {
        $this->publicUrl = $publicUrl;

        return $this;
    }

    public function getKey(): string
    {
        return $this->key;
    }

    public function setKey(string $key): UploadFile
    {
        $this->key = $key;

        return $this;
    }

    public function getSignedUrl(): string
    {
        return $this->signedUrl;
    }

    public function setSignedUrl(string $signedUrl): UploadFile
    {
        $this->signedUrl = $signedUrl;

        return $this;
    }

    public function getDirectory(string $default): string
    {
        if (! $this->directory) {
            return $default;
        }

        return $this->directory;
    }

    public function setDirectory(string $directory): UploadFile
    {
        $this->directory = $directory;

        return $this;
    }

    public function getBucket(): string
    {
        return $this->bucket;
    }

    public function setBucket(string $bucket): UploadFile
    {
        $this->bucket = $bucket;

        return $this;
    }
}
