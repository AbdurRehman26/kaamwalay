<?php

namespace App\Services\FileService;

use App\Http\Requests\API\Files\UploadRequest;

class UploadFile
{
    protected string $signedUrl;
    protected string $url;
    protected string $key;

    public function __construct(
        protected string $fileName,
        protected string $contentType,
        protected int $size,
        protected string $prefix = '',
        protected string $suffix = '',
    ) {
    }

    public static function fromRequest(UploadRequest $request): static
    {
        $data = $request->validated();

        return new static(
            $data['file_name'],
            $data['content_type'],
            (int)$data['size'],
            $data['prefix'] ?? '',
            $data['suffix'] ?? '',
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

    public function getPrefix(): string
    {
        return $this->prefix;
    }

    public function setPrefix(string $prefix): static
    {
        $this->prefix = $prefix;

        return $this;
    }

    public function getSuffix(): string
    {
        return $this->suffix;
    }

    public function setSuffix(string $suffix): static
    {
        $this->suffix = $suffix;

        return $this;
    }

    public function getUrl(): string
    {
        return $this->url;
    }

    public function setUrl(string $url): static
    {
        $this->url = $url;

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
}
