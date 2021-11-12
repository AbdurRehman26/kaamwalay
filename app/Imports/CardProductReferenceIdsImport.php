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
            $cardNumberOrder = ! empty($row['card_number_order']) ? $row['card_number_order'] : '';

            $cardProduct = CardProduct::where('card_set_id', '=', $cardSet->id)
                    ->whereName(trim($row['card_name']))
                    ->whereNull('card_reference_id');

            if ($cardProduct->get()->count() === 1) {
                continue;
            }

            if ($cardProduct->get()->count() > 1) {
                $cardProduct->where('image_path', '=', $row['image']);
            }

            if ($cardProduct->get()->count() > 1) {
                $cardProduct->where('card_number_order', '=', $cardNumberOrder);
            }

            if ($cardProduct->get()->count() > 1) {
                if ($this->compareModels($cardProduct->get())) {
                    echo("Same models\n");
                    continue;
                }
            }

            if ($cardProduct->get()->count() > 1) {
                dd($row, $cardProduct->get());
            }

            if ($cardProduct->get()->count() === 0) {
                dd($row, $cardProduct->toSql(), $cardProduct->getBindings(), $key);
                dd($row, $key);
            }
            echo $cardProduct->get()->count() . "\n";

            continue;
            dd($row, $cardProduct->get()->count());

            if (empty($cardProduct)) {
                dd($variant, $edition, $cardProduct, $key, $cardSet->id, $row);
            }
            echo $key;

            if ($cardProduct['surface'] !== $surface) {
                \Log::info("Incorrect surface values");
//                    dd($row, $cardProduct);
            }
        }
    }

    protected function compareModels(collection $cardProducts): bool
    {
        foreach ($cardProducts as $key => $cardProduct) {
            if ($key + 1 < $cardProducts->count()) {
                if ($cardProduct->getSearchableName() !== $cardProducts[$key + 1]->getSearchableName()) {
                    return false;
                }
            }
        }

        return true;
    }


    public function batchSize(): int
    {
        return 25000;
        // TODO: Implement batchSize() method.
    }

    public function chunkSize(): int
    {
        return 25000;
        // TODO: Implement chunkSize() method.
    }
}
