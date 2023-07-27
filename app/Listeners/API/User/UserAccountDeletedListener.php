<?php

namespace App\Listeners\API\User;

use App\Events\API\User\UserAccountDeletedEvent;
use App\Models\CustomerAddress;
use App\Models\Order;
use App\Models\OrderAddress;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Collection;

class UserAccountDeletedListener implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    public function handle(UserAccountDeletedEvent $event): void
    {
        $userId = $event->userId;

        // Delete all customer addresses
        CustomerAddress::where('user_id', $userId)->delete();

        /**
         * @var $orders Collection
         */
        $orders = Order::where('user_id', $userId)->get();
        $shippingAddressesIds = $orders->pluck('shipping_order_address_id')->filter()->values()->toArray();
        $billingAddressesIds = $orders->pluck('billing_order_address_id')->filter()->values()->toArray();

        // Detach addresses from orders
        Order::where('user_id', $userId)->update([
            'shipping_order_address_id' => null,
            'billing_order_address_id' => null,
        ]);

        // Delete all order addresses that are assigned to user's orders
        OrderAddress::whereIn(
            'id',
            array_unique(array_merge($shippingAddressesIds, $billingAddressesIds))
        )->delete();

        /**
         * Delete user's payment methods
         *
         * @var $user User
         */
        $user = User::find($userId);
        $user->deletePaymentMethods();

        $user->update([
            'stripe_id' => null,
            'pm_type' => null,
            'pm_last_four' => null,
            'is_active' => false,
        ]);

        $user->delete();
    }
}
