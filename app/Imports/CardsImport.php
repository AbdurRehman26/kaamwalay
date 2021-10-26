<?php

namespace App\Imports;

use App\Models\CardProduct;
use App\Models\CardSeries;
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
        CardProduct::disableSearchSyncing();

        foreach ($rows as $row) {
            $cardSeries = CardSeries::firstOrCreate(['name' => $row['series'] . ' Series', 'card_category_id' => 1]);

            $cardSet = CardSet::firstOrCreate(['name' => $row['set'], 'card_series_id' => $cardSeries->id, 'card_category_id' => 1]);

            CardProduct::create([
                'card_id' => $row['card_id'],
                'name' => $row['card_name'],
                'card_set_id' => $cardSet->id,
                'card_category_id' => 1,
                'rarity' => $row['rarity'],
                'card_number' => str_replace(' ', '', $row['card_number']),
                'card_number_order' => str_replace(' ', '', $row['card_number_order']),
                'image_path' => $row['image'],
                'card_url' => $row['card_url'],
                'language' => $row['language'],
                'edition' => ! empty($row['edition']) ? $row['edition'] : '',
                'surface' => ! empty($row['surface']) ? $row['surface'] : '',
                'variant' => ! empty($row['variant']) ? $row['variant'] : '',
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
