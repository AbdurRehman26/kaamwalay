<?php

namespace App\Http\Controllers\API\V2\Customer\Vault;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V2\Customer\Vault\VaultItemCollection;
use App\Models\VaultItem;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class VaultItemController extends Controller
{
    public function index(): VaultItemCollection
    {
        $vaultItems = QueryBuilder::for(VaultItem::class)
            ->whereBelongsTo(auth()->user())
            ->allowedFilters([
                AllowedFilter::exact('status'),
            ])
            ->allowedFilters([
                'userCard',
            ])
            ->latest()
            ->get();

        return new VaultItemCollection($vaultItems);
    }

    public function show(VaultItem $vaultItem): VaultItemResource
    {
        $vaultItem->load('userCard', 'order');

        return new VaultItemResource($vaultItem);
    }
}
