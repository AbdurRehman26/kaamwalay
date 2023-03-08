<?php

namespace App\Http\Filters;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class VaultShipmentSearchFilter implements Filter
{
    public function __invoke(Builder $query, mixed $value, string $property): void
    {
        $query->whereLike(
            [
                'shipment_number',
                'vaultShipmentItems.userCard.certificate_number',
            ],
            $value
        );
    }
}
