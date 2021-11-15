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

class CardProductAttributesUpdate implements ToCollection, WithBatchInserts, WithChunkReading, WithHeadingRow
{
    public function collection(Collection $rows)
    {
        CardProduct::disableSearchSyncing();

        foreach ($rows as $row) {
            $cardSeries = CardSeries::where('name',  '=', $row['series'] . ' Series')
                    ->orWhere('name', '=', $row['series'])->first();

            if (empty($cardSeries)) {
                throw new \Exception('Card series not found', 404);
            }

            $cardSet = CardSet::where('name', '=', $row['set'])
                    ->where('card_series_id', '=', $cardSeries->id)->first();

            if (empty($cardSet)) {
                throw new \Exception('Card set not found', 404);
            }

            $cardNumberOrder = ! empty($row['card_number_order']) ? $row['card_number_order'] : '';

            $cardProduct = CardProduct::where('card_set_id', '=', $cardSet->id)
                    ->whereName(trim($row['card_name']))
                    ->whereNull('card_reference_id');

            if ($cardProduct->get()->count() === 1) {
                $this->updateCardProduct($cardProduct->first(), $row);

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
                    foreach ($cardProduct->get() as $card) {
                        $this->updateCardProduct($card, $row);
                    }
                    echo("Same models\n");

                    continue;
                }
            }

            if ($cardProduct->get()->count() > 1) {
                \Log::info('Still move than one record found: '. $row['card_name'] . ' ' . $row['card_number']);

                throw new \Exception('Multiple records found', 503);
            }

            if ($cardProduct->get()->count() === 0) {
                \Log::info('Product not found: '. $row['card_name'] . ' ' . $row['card_number']);

                throw new \Exception('No Record found', 404);
            }

            $this->updateCardProduct($cardProduct->first(), $row);
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

    protected function updateCardProduct(CardProduct $card, $row): void
    {
        $edition = ! empty($row['edition']) ? $row['edition'] : '';
        $surface = ! empty($row['surface']) ? $row['surface'] : '';
        $variant = ! empty($row['variant']) ? $row['variant'] : '';
        $cardNumber = ! empty($row['card_number']) ? $row['card_number'] : '';

        $card->card_number = $row['card_number'];
        $card->variant = $variant;
        $card->edition = $edition;
        $card->surface = $surface;
        $card->rarity = $row['rarity'];
        $card->card_number_order = $cardNumber;
        $card->card_reference_id = $row['card_id'];
        $card->save();
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
