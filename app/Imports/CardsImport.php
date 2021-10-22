<?php

namespace App\Imports;

use App\Models\CardProduct;
use App\Models\CardSet;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class CardsImport implements ToCollection, WithBatchInserts, WithChunkReading, WithHeadingRow
{
    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            $setNameArray = explode('Set: ', $row['set_name']);
            $cardNumberOrder = explode('/', $row['card_number']);

            if (empty($setNameArray[1])) {
                $setNameArray[1] = $setNameArray[0];
            }
            CardProduct::create([
                'name' => $row['name'],
                'card_set_id' => CardSet::whereName($setNameArray[1])->first()->id,
                'card_category_id' => 1,
                'rarity' => $row['rarity'],
                'card_number' => str_replace(' ', '', $row['card_number']),
                'image_path' => $row['image_path'],
                'card_url' => $row['card_url'],
                'card_number_order' => str_replace(' ', '', $cardNumberOrder[0]),
                'variant_category' => $row['variant_category'],
                'variant_name' => $row['variant_name'],
                'holo_type' => ! empty($row['holo_type']) ? $row['holo_type'] : "",
                'created_at' => Carbon::now()->toDateString(),
                'updated_at' => Carbon::now()->toDateString(),
            ]);
        }
    }

    public function batchSize(): int
    {
        return 1000;
        // TODO: Implement batchSize() method.
    }

    public function chunkSize(): int
    {
        return 1000;
        // TODO: Implement chunkSize() method.
    }
}
