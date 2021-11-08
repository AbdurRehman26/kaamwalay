<?php

namespace App\Imports;

use App\Models\CardSeries;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class CardSeriesImport implements ToCollection, WithHeadingRow
{
    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            $cardSeries = CardSeries::whereName($row['name'])->first();
            if (empty($cardSeries)) {
                CardSeries::create([
                   'name' => $row['name'],
                   'image_path' => $row['image_path'],
                   'card_category_id' => 1,
                    'image_bucket_path' => '',
                ]);
            }
        }
    }
}
