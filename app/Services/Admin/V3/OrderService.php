<?php

namespace App\Services\Admin\V3;

use App\Events\API\Order\V3\OrderShippingAddressChangedEvent;
use App\Exceptions\API\Admin\IncorrectOrderStatus;
use App\Models\Country;
use App\Models\Order;
use App\Models\OrderAddress;
use App\Models\UserCard;
use App\Services\Admin\V2\OrderService as V2OrderService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\QueryBuilder;

class OrderService extends V2OrderService
{
    public function updateShippingAddress(Order $order, array $data): Order
    {
        $data['country_id'] = Country::whereCode($data['country_code'] ?? 'US')->first()->id;
        $data['phone'] = $data['phone'] ?? '';

        $orderAddress = OrderAddress::create($data);

        if ($order->hasBillingAddress() && $order->hasSameShippingAndBillingAddresses()) {
            $order->billingAddress()->associate($orderAddress);
        }

        $order->shippingAddress()->associate($orderAddress);

        $order->save();

        OrderShippingAddressChangedEvent::dispatch($order);

        return $order;
    }

    /**
     * @return LengthAwarePaginator<UserCard>
     * @throws IncorrectOrderStatus
     */
    public function getPaginatedCardsForGrading(Order $order): LengthAwarePaginator
    {
        if (! $order->canBeGraded()) {
            throw new IncorrectOrderStatus;
        }

        $query = UserCard::join('order_items', 'user_cards.order_item_id', '=', 'order_items.id')
            ->where('order_items.order_id', $order->id)->select('user_cards.*');

        // @phpstan-ignore-next-line
        return QueryBuilder::for($query)
            ->allowedFilters(UserCard::allowedFilters())
            ->paginate(request('per_page', 24));
    }

    public function detachTags(array $orderIds, string $tag = 'abandoned'): void
    {
        Order::whereIn('id', $orderIds)->get()->map(function (Order $order) use ($tag) {
            $order->detachTag($tag);
        });
    }
    public function attachTags(array $orderIds, string $tag = 'abandoned'): void
    {
        Order::whereIn('id', $orderIds)->get()->map(function (Order $order) use ($tag) {
            $order->attachTag($tag);
        });
    }
}
