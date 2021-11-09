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

                unset($cardProductData['card_name']);
                CardProduct::create($cardProductData);
            } catch (\Exception $e) {
                dd($row, $cardSeries, $cardSet);
            }
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
