<?php

namespace App\Services\Card;

use App\Models\CardProduct;

class CardProductService
{
    public function create(array $data): CardProduct
    {
        return CardProduct::create(array_merge(
            $data,
            [
                'added_manually' => true,
                'added_by' => auth()->user()->id,
            ]
        ));
    }
}
