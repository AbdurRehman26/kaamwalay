<?php

namespace App\Imports;

use App\Models\CardProduct;
use App\Models\CardSeries;
use App\Models\CardSet;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class CardProductReferenceIdsImport implements ToCollection, WithBatchInserts, WithChunkReading, WithHeadingRow
{
    public function collection(Collection $rows)
    {
        CardProduct::disableSearchSyncing();

        foreach ($rows as $key => $row) {

            $cardSeries = CardSeries::where('name',  '=', $row['series'] . ' Series')
                    ->orWhere('name', '=', $row['series'])->first();

            $cardSet = CardSet::where('name', '=', $row['set'])
                    ->where('card_series_id', '=', $cardSeries->id)->first();

            $edition = ! empty($row['edition']) ? $row['edition'] : '';
            $surface = ! empty($row['surface']) ? $row['surface'] : '';
            $variant = ! empty($row['variant']) ? $row['variant'] : '';
            $cardNumber = ! empty($row['card_number']) ? $row['card_number'] : '';

            $cardProduct = CardProduct::where('card_set_id', '=', $cardSet->id)
                    ->whereName(trim($row['card_name']))
                    ->where('card_number', '=', $cardNumber)
                    ->where('edition', $edition)
//                ->where('surface', $surface)
                    ->where('variant', $variant)
                    ->whereNull('card_reference_id')
                    ->get()
                    ->first();

            $keys = [127, 159, 173, 252, 587, 664, 665, 863, 885, 892, 1062, 1389, 1390, 1391, 1392, 1581, 1582, 1629, 1699, 2082,
                2083, 2114, 2318, 2369, 3918, 3919, 3920, 7512, 7513, 7514, 14307, 14342, 14343, 14841,
                ];

            if (in_array($key, $keys)
                || ($key > 255 && $key < 378)
                || ($key > 685 && $key < 697)
                || ($key > 1784 && $key < 1881)
                || ($key > 4083 && $key < 4093)
                || ($key > 4541 && $key < 4574)
                || ($key > 10312 && $key < 10339)
                || ($key > 11555 && $key < 11589)
                || ($key > 11737 && $key < 11770)
                || ($key > 13272 && $key < 13282)
            ) {
                continue;
            }

            if (empty($cardProduct)) {
                dd($variant, $edition, $cardProduct, $key, $cardSet->id, $row);
            }


            if ($cardProduct['surface'] !== $surface) {
                \Log::info("Incorrect surface values");
//                    dd($row, $cardProduct);
            }
        }
    }

    public function batchSize(): int
    {
        return 15000;
        // TODO: Implement batchSize() method.
    }

    public function chunkSize(): int
    {
        return 15000;
        // TODO: Implement chunkSize() method.
    }
}
