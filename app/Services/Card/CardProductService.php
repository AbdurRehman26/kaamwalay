<?php

namespace App\Services\Card;

use App\Jobs\Images\ImageOptimizer;
use App\Models\CardProduct;

class CardProductService
{
    public function create(array $data): CardProduct
    {
        $card = CardProduct::create(array_merge(
            $data,
            [
                'added_manually' => true,
                'added_by' => auth()->user()->id,
            ]
        ));

        ImageOptimizer::dispatch($card, 'image_path', 'cards', 'jpg', 788, 788, 70);

        return $card;
    }
}
