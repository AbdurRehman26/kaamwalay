<?php

namespace App\Services\Card;

use App\Jobs\ProcessImage;
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

        ProcessImage::dispatch($card, 'image_path', 'cards', 'jpg', 788, 788, 70)->delay(now()->addSeconds(10));

        return $card;
    }
}
