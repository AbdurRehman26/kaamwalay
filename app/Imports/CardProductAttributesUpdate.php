<?php

namespace App\Imports;

use App\Models\CardProduct;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class CardProductAttributesUpdate implements ToCollection, WithHeadingRow
{
    /**
     * @throws \Throwable
     */
    public function collection(Collection $rows): void
    {
        foreach ($rows as $key => $row) {

            $cardProduct = CardProduct::where('card_reference_id', '=', $row['card_id']);

            echo 'Excel key fetched:' . $key . "\n";

            throw_if(!$cardProduct->count());

            $cardProduct = $cardProduct->first();
            $cardProduct->card_url = $row['card_url'];
            $cardProduct->image_path = $row['image'];
            $cardProduct->save();

        }
    }
}
