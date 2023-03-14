<?php

namespace App\Http\Resources\API\V1\Files;

use App\Http\Resources\API\BaseResource;
use Illuminate\Http\Request;

class PresignUploadResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'size' => $this->getSize(),
            'file_name' => $this->getFileName(),
            'content_type' => $this->getContentType(),
            'signed_url' => $this->getSignedUrl(),
            'public_url' => $this->getPublicUrl(),
            'key' => $this->getKey(),
        ];
    }
}
