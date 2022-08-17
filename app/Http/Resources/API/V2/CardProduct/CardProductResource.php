<?php

namespace App\Http\Resources\API\V2\CardProduct;

use App\Http\Resources\API\V1\CardProduct\CardProductResource as V1CardProductResource;

/**
 * @property-read int $population
*/
class CardProductResource extends V1CardProductResource
{
    public function toArray($request): array
    {
        $data = parent::toArray($request);

        return array_merge($data, [
            $this->mergeWhen($this->population, [
                'population' => $this->population,
            ]),
        ]);
    }
}
