<?php

namespace App\Services\VaultShipment\V2;

use App\Http\Filters\VaultShipmentSearchFilter;
use App\Models\User;
use App\Models\VaultShipment;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class VaultShipmentService
{
    public function getVaultShipments(): LengthAwarePaginator
    {
        /* @var User $user */
        $user = auth()->user();
        $itemsPerPage = request('per_page');

        $query = VaultShipment::query()->forUser($user);

        return QueryBuilder::for($query)
            ->allowedFilters([AllowedFilter::custom('search', new VaultShipmentSearchFilter)])
            ->defaultSort('-vault_shipments.created_at')
            ->paginate($itemsPerPage);
    }

}
