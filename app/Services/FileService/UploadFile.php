<?php

namespace App\Services\FileService;

use App\Http\Requests\API\Files\PresignUploadRequest;

class UploadFile
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
    ) {
    }

    public static function fromRequest(PresignUploadRequest $request): static
    {
        $data = $request->validated();

        return new static(
            $data['file_name'],
            $data['content_type'],
            (int)$data['size'],
            $data['prefix'] ?? '',
            $data['suffix'] ?? '',
            $data['directory'] ?? '',
        );
    }

    public function setSize(int $size): static
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

    public function setFileName(string $fileName): static
    {
        $this->fileName = $fileName;

        return $this;
    }

    public function getContentType(): string
    {
        return $this->contentType;
    }

    public function setContentType(string $contentType): static
    {
        $this->contentType = $contentType;

        return $this;
    }

    public function getPrefix($default): string
    {
        if (! $this->prefix) {
            return $default;
        }

        return $this->prefix;
    }

    public function setPrefix(string $prefix): static
    {
        $this->prefix = $prefix;

        return $this;
    }

    public function getSuffix($default): string
    {
        if (! $this->suffix) {
            return  $default;
        }

        return $this->suffix;
    }

    public function setSuffix(string $suffix): static
    {
        $this->suffix = $suffix;

        return $this;
    }

    public function getPublicUrl(): string
    {
        return $this->publicUrl;
    }

    public function setPublicUrl(string $publicUrl): static
    {
        $this->publicUrl = $publicUrl;

        return $this;
    }

    public function getKey(): string
    {
        return $this->key;
    }

    public function setKey(string $key): static
    {
        $this->key = $key;

        return $this;
    }

    public function getSignedUrl(): string
    {
        return $this->signedUrl;
    }

    public function setSignedUrl(string $signedUrl): static
    {
        $this->signedUrl = $signedUrl;

        return $this;
    }

    public function getDirectory($default): string
    {
        if (! $this->directory) {
            return $default;
        }

        return $this->directory;
    }

    public function setDirectory(string $directory): static
    {
        $this->directory = $directory;

        return $this;
    }
}
