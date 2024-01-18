<?php

namespace App\Imports;

use App\Models\AutographCategory;
use App\Models\AutographProduct;
use App\Models\AutographType;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class AutographProductsImport implements ToCollection, WithHeadingRow
{
    use Importable;

    protected const DEFAULT_IMAGE = 'https://ags-cdn.s3.amazonaws.com/images/ags-logo.jpg';

    /**
     * @param  Collection<int,array>  $collection
     */
    public function collection(Collection $collection): void
    {
        // Validate columns in CSV
        Validator::make($collection->toArray(), [
            '*.certificate_number' => ['required', 'string'],
            '*.category' => ['required', 'string'],
            '*.type' => ['required', 'string'],
            '*.name' => ['required', 'string'],
            '*.signed_by' => ['required', 'string'],
            '*.date_signed' => ['required', 'date'],
        ])->validate();

        // Find unique categories and create them in database
        foreach ($collection->unique('category') as $row) {
            AutographCategory::firstOrCreate([
                'name' => ucfirst($row['category']),
            ]);
        }

        // Find unique types and create them in database
        foreach ($collection->unique('type') as $row) {
            AutographType::firstOrCreate([
                'name' => ucfirst($row['type']),
            ]);
        }

        // Load categories and types in memory
        $categories = AutographCategory::all();
        $types = AutographType::all();

        // Create autograph products
        foreach ($collection as $row) {
            AutographProduct::create([
                'autograph_category_id' => $categories->where('name', $row['category'])->first()->id,
                'autograph_type_id' => $types->where('name', $row['type'])->first()->id,
                'certificate_number' => $row['certificate_number'],
                'name' => $row['name'],
                'image_url' => static::DEFAULT_IMAGE,
                'signed_by' => $row['signed_by'],
                'signed_at' => Carbon::parse($row['date_signed']),
            ]);
        }
    }
}
