<?php

namespace App\Http\Resources\API\V2\CardProduct;

use App\Http\Resources\API\V1\CardProduct\CardProductResource as V1CardProductResource;

class CardProductResource extends V1CardProductResource
{
    public function toArray($request): array
    {
        $data = parent::toArray($request);

        return array_merge($data, [
            'population' => 10,
        ]);
    }
}
