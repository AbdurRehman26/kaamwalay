<?php

namespace App\Services\Card;

use App\Models\CardProduct;
use Illuminate\Support\Facades\Log;

class CardProductService
{
    public function __construct()
    {
    }

    public function create(array $data): CardProduct
    {
        Log::debug($data);
        return CardProduct::create(array_merge(
            $data,
            [
                'added_manually' => true,
                'added_by_id' => auth()->user()->id
            ]
        ));
    }
}
