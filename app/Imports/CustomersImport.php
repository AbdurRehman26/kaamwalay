<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Illuminate\Support\Arr;

class CustomersImport implements ToCollection
{
    /**
    * @param Collection<int,array> $collection
    * @return array
    */
    public function collection(Collection $collection): array
    {
        return $collection->toArray();
    }
}
