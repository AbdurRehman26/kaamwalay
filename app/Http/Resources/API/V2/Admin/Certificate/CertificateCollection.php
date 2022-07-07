<?php

namespace App\Http\Resources\API\V2\Admin\Certificate;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class CertificateCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request): array
    {
        return parent::toArray($request);
    }
}
