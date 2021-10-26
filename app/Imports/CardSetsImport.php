<?php

namespace App\Imports;

use App\Models\CardSet;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class CardSetsImport implements ToCollection, WithBatchInserts, WithChunkReading, WithHeadingRow
{
    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {

            $releaseDate = $row['release_date'];
            $releaseYear = Carbon::parse($row['release_date'])->year;
            $formattedDate = Carbon::parse($row['release_date'])->toFormattedDateString();

            if (! $row['name']) {
                continue;
            }

            CardSet::create([
                'card_series_id' => 1,
                'card_category_id' => 1,
                'name' => $row['name'],
                'description' => $row['description'],
                'cards_number' => $row['cards_number'],
                'image_path' => $row['image_path'],
                'secret_cards' => $row['secret_cards'],
                'set_url' => $row['set_url'],
                'release_date' => $releaseDate,
                'release_year' => $releaseYear,
                'image_bucket_path' => "",
                'release_date_formatted' => $formattedDate,
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
