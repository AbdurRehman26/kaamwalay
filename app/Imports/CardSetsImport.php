<?php

namespace App\Imports;

use App\Models\CardSeries;
use App\Models\CardSet;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class CardSetsImport implements ToCollection, WithHeadingRow
{
    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {

            $cardSeries = CardSeries::whereName($row['serie_id'])->first();
            $cardSet = CardSet::whereName($row['name'])->where('card_series_id', $cardSeries->id)->first();

            if (empty($cardSet)) {
                $releaseDate = Carbon::parse($row['release_date']);
                $formattedDate = $releaseDate->format('M jS Y');
                $cardSetData = $row;
                $cardSetData['card_category_id'] = 1;
                $cardSetData['card_series_id'] = $cardSeries['id'];
                $cardSetData['release_date_formatted'] = $formattedDate;
                $cardSetData['release_date'] = $releaseDate->toDateString();
                $cardSetData['release_year'] = $releaseDate->year;
                $cardSetData['image_bucket_path'] = '';
                $cardSetData['description'] = ! empty($row['description']) ? $row['description'] : '';
                $cardSetData['secret_cards'] = ! empty($row['secret']) ? $row['secret'] : 0;

                unset($cardSetData['serie_id'], $cardSetData['serie_id']);
                CardSet::create($cardSetData->toArray());
            }
        }
    }
}
