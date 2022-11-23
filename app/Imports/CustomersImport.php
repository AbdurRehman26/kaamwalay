<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;

class CustomersImport implements ToCollection
{
    /**
    * @param Collection<int,array> $collection
    * @return array
    */
    public function collection(Collection $collection): array
    {
        $emails = [];

        foreach ($collection as $row) {
            array_push($emails, $row[0]);
        }
        
        return $emails;
    }
}
