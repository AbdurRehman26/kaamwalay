<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;

class SalesManImport implements ToCollection
{
    /**
    * @param Collection $collection
    */
    public function collection(Collection $collection)
    {
        $emails = [];

        foreach ($collection as $row) {
            array_push($emails, $row[0]);
        }
        
        return $emails;
    }
}
