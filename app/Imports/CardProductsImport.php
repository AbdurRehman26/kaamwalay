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

class CardProductsImport implements ToCollection, WithBatchInserts, WithChunkReading, WithHeadingRow
{
    public function collection(Collection $rows)
    {
        CardProduct::disableSearchSyncing();

        foreach ($rows as $key => $row) {
            try {
                $cardSeries = CardSeries::where('name',  '=', $row['series'] . ' Era')
                ->orWhere('name', '=', $row['series'])->first();

                $setName = $row['set'];

                if ($setName === 'Awakening Psychic King') {
                    $setName = 'Awakening of Psychic King';
                }

                if ($setName === 'Miracle Twin') {
                    $setName = 'Miracle Twins';
                }


                $cardSet = CardSet::where(function ($query) use ($setName) {
                    $query->where('name', '=', $setName)->
                        orWhere('name', '=', $setName . ' Set');
                })
                ->where('card_series_id', '=', $cardSeries->id)->first();

                $edition = ! empty($row['edition']) ? $row['edition'] : '';
                $surface = ! empty($row['surface']) ? $row['surface'] : '';
                $variant = ! empty($row['variant']) ? $row['variant'] : '';
                $cardNumber = ! empty($row['card_number']) ? $row['card_number'] : '';

                $cardProduct = CardProduct::where('card_set_id', '=', $cardSet->id)
                ->whereName(trim($row['card_name']))
                ->where('card_number', '=', $cardNumber)
                ->where('edition', $edition)
                ->where('surface', $surface)
                ->where('variant', $variant)
                ->whereNull('card_reference_id')
                ->get()
                ->first();

                if ($cardProduct) {
                    continue;
                }

                $releaseDate = \Carbon\Carbon::parse($row['release_date']);
                $cardProductData = $row->toArray();
                $cardProductData['card_category_id'] = 1;
                $cardProductData['name'] = $cardProductData['card_name'];
                $cardProductData['release_date_formatted'] = $releaseDate->format('M jS Y');
                $cardProductData['release_date'] = $releaseDate->toDateString();
                $cardProductData['release_year'] = $releaseDate->year;
                $cardProductData['edition'] = $edition;
                $cardProductData['variant'] = $variant;
                $cardProductData['surface'] = $surface;
                $cardProductData['card_set_id'] = $cardSet->id;
                $cardProductData['card_reference_id'] = $row['card_id'];
                $cardProductData['image_path'] = $row['image'];

                unset($cardProductData['card_name']);
                CardProduct::create($cardProductData);
            } catch (\Exception $e) {
                dd($row, $cardSet, $key, $e->getMessage());
            }
        }
    }

    public function batchSize(): int
    {
        return 9000;
        // TODO: Implement batchSize() method.
    }

    public function chunkSize(): int
    {
        return 9000;
        // TODO: Implement chunkSize() method.
    }
}
