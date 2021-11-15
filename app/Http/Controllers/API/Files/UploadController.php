<?php

namespace App\Http\Controllers\API\Files;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\Files\PresignUploadRequest;
use App\Http\Resources\API\Files\PresignUploadResource;
use App\Services\FileService\FileService;
use App\Services\FileService\UploadFile;

class UploadController extends Controller
{
    public function __construct(
        private FileService $fileService
    ) {
    }

    public function presignUpload(PresignUploadRequest $request): PresignUploadResource
    {
        $result = $this->fileService->presignUploadFile(UploadFile::fromRequest($request));

        return PresignUploadResource::make($result);
    }
}
