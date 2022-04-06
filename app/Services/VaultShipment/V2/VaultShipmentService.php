<?php

namespace App\Services\VaultShipment\V2;

use App\Events\API\Order\V1\OrderStatusChangedEvent;
use App\Http\Resources\API\V1\Customer\Order\OrderPaymentResource;
use App\Models\CardProduct;
use App\Models\Order;
use App\Models\OrderAddress;
use App\Models\OrderItem;
use App\Models\OrderItemStatus;
use App\Models\OrderItemStatusHistory;
use App\Models\OrderStatus;
use App\Models\OrderStatusHistory;
use App\Models\User;
use App\Models\VaultShipment;
use App\Services\Payment\V1\Providers\CollectorCoinService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class VaultShipmentService
{
    public function getVaultShipments(): LengthAwarePaginator
    {
        /* @var User $user */
        $user = auth()->user();
        $itemsPerPage = request('per_page');

        return QueryBuilder::for(VaultShipment::class)
            ->forUser($user)
            ->allowedFilters([AllowedFilter::partial('shipment_number')])
            ->defaultSort('-vault_shipments.created_at')
            ->paginate($itemsPerPage);
    }

}
