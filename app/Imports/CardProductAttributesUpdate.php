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
    public function collection(Collection $rows): void
    {
        CardProduct::disableSearchSyncing();

        foreach ($rows as $key => $row) {
            $cardSeries = CardSeries::where('name',  '=', $row['series'] . ' Series')
                    ->orWhere('name', '=', $row['series'])->first();

            if (empty($cardSeries)) {
                throw new \Exception('Card series not found');
            }

            $cardSet = CardSet::where('name', '=', $row['set'])
                    ->where('card_series_id', '=', $cardSeries->id)->first();

            if (empty($cardSet)) {
                throw new \Exception('Card set not found');
            }

            $cardProduct = CardProduct::where('card_set_id', '=', $cardSet->id)
                    ->whereName(trim($row['card_name']));

            echo 'Excel key fetched:' . $key . "\n";

            if ($cardProduct->count() === 1) {
                $this->updateCardProduct($cardProduct->first(), $row);

                continue;
            }

            if ($cardProduct->count() > 1) {
                $cardProduct->where('image_path', '=', $row['image']);
            }

            $cardNumberOrder = $row['card_number_order'] ?? '';

            if ($cardProduct->count() > 1) {
                $cardProduct->where('card_number_order', '=', $cardNumberOrder);
            }

            if ($cardProduct->count() > 1) {
                if ($this->compareModels($cardProduct->get())) {
                    foreach ($cardProduct->get() as $card) {
                        echo $card->id . " updating for same model\n";
                        $this->updateCardProduct($card, $row);
                    }

                    continue;
                }
            }

            if ($cardProduct->count() > 1) {
                throw new \Exception('Multiple records found');
            }

            if ($cardProduct->count() === 0) {
                throw new \Exception('No Record found');
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

    protected function updateCardProduct(CardProduct $card, Collection $row): void
    {
        echo $card->id . " updating for card record\n";

        $card->card_number = $row['card_number'];
        $card->variant = $row['variant'] ?? '';
        $card->edition = $row['edition'] ?? '';
        $card->surface = $row['surface'] ?? '';
        $card->rarity = $row['rarity'];
        $card->card_reference_id = $row['card_id'];
        $card->save();

        echo $card->id . " updated\n";
    }

    public function batchSize(): int
    {
        return 25000;
    }

    public function chunkSize(): int
    {
        return 25000;
    }
}