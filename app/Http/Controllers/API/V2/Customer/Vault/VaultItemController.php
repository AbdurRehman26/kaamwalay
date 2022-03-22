<?php

namespace App\Http\Controllers\API\V2\Customer\Vault;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V2\Customer\Vault\VaultItemCollection;
use App\Http\Resources\API\V2\Customer\Vault\VaultItemResource;
use App\Models\VaultItem;
use Illuminate\Http\Request;

class VaultItemController extends Controller
{
    public function index(): VaultItemCollection
    {
        $vaultItems = VaultItem::belongsToUser(auth()->user())
            ->latest()
            ->get();

        return new VaultItemCollection($vaultItems);
    }
}
