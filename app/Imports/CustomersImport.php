<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;

class CustomersImport implements ToCollection
{
    /**
     * @param  Collection<int,array>  $collection
     */
    public function collection(Collection $collection): array
    {
        return $collection->toArray();
    }
}
