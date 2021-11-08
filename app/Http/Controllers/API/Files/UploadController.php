<?php

namespace App\Http\Controllers\API\Files;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\Files\UploadRequest;
use App\Http\Resources\API\Files\UploadResource;
use App\Services\FileService\FileService;

class UploadController extends Controller
{
    public function __construct(
        private FileService $fileService
    ) {
    }

    public function presignUpload(UploadRequest $request): UploadResource
    {
        $result = $this->fileService->preSignFileFromRequest($request);

        return UploadResource::make($result);
    }
}
