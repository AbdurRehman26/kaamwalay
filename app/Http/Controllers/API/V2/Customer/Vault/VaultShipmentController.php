<?php

namespace App\Http\Controllers\API\V2\Customer\Vault;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V2\Customer\Vault\VaultShipmentCollection;
use App\Models\VaultShipment;
use Illuminate\Http\Request;

class VaultShipmentController extends Controller
{
    public function index(): VaultShipmentCollection
    {
        $shipments = VaultShipment::query()
           ->whereBelongsTo(auth()->user())
            ->with('vaultShipmentStatus')
            ->withSum('vaultItems', 'cards_count')
            ->latest()
            ->get();

        return new VaultShipmentCollection($shipments);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }
}
