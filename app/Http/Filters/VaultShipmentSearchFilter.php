<?php

namespace App\Http\Filters;

use App\Models\VaultShipment;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class VaultShipmentSearchFilter implements Filter
{
    /**
     * @param  Builder<VaultShipment>  $query
     */
    public function __invoke(Builder $query, string $value, string $property): void
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
