<?php

namespace App\Services\Order\V2;

use App\Http\Resources\API\V2\Customer\Order\OrderPaymentResource;
use App\Models\CustomerAddress;
use App\Models\Order;
use App\Models\OrderAddress;
use App\Models\ShippingMethod;
use App\Services\EmailService;
use App\Services\Order\Shipping\ShippingFeeService;
use App\Services\Order\V1\OrderService as V1OrderService;
use App\Services\Payment\V2\Providers\CollectorCoinService;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;

class OrderService extends V1OrderService
{
    public function getDataForCustomerSubmissionConfirmationEmail(Order $order): array
    {
        $data = [];

        $paymentPlan = $order->paymentPlan;
        $orderItems = $order->getGroupedOrderItems();
        $orderPayment = OrderPaymentResource::make($order->firstOrderPayment)->resolve();

        $data["SUBMISSION_NUMBER"] = $order->order_number;
        $data["SHIPPING_INSTRUCTIONS_URL"] = config('app.url') . '/dashboard/submissions/' . $order->id . '/confirmation';

        $items = [];
        foreach ($orderItems as $orderItem) {
            $card = $orderItem->cardProduct;
            $items[] = [
                "CARD_IMAGE_URL" => $card->image_path,
                "CARD_NAME" => $card->name,
                "CARD_FULL_NAME" => $this->getCardFullName($card),
                "CARD_VALUE" => number_format($orderItem->declared_value_per_unit, 2),
                "CARD_QUANTITY" => $orderItem->quantity,
                "CARD_COST" => number_format($orderItem->quantity * $paymentPlan->price, 2),
            ];
        }

        $data["ORDER_ITEMS"] = $items;
        $data["SUBTOTAL"] = number_format($order->service_fee, 2);
        $data["SHIPPING_FEE"] = number_format($order->shipping_fee, 2);
        $data["TOTAL"] = number_format($order->grand_total, 2);

        $data["SERVICE_LEVEL"] = $paymentPlan->price;
        $data["NUMBER_OF_CARDS"] = $orderItems->sum('quantity');
        $data["DATE"] = $order->created_at->format('m/d/Y');
        $data["TOTAL_DECLARED_VALUE"] = number_format($order->orderItems->sum('declared_value_per_unit'), 2);

        $data["SHIPPING_ADDRESS"] = $this->getAddressData($order->shippingAddress);
        $data["BILLING_ADDRESS"] = ! empty($order->billingAddress) ? $this->getAddressData($order->billingAddress) : [];
        $data["PAYMENT_METHOD"] = $this->getOrderPaymentText($orderPayment);

        return $data;
    }

    public function getDataForCustomerOrderPaid(Order $order): array
    {
        $data = [];

        $orderPayment = OrderPaymentResource::make($order->firstOrderPayment)->resolve();

        $data["SUBMISSION_NUMBER"] = $order->order_number;
        $data["TOTAL"] = number_format($order->grand_total, 2);
        $data["BILLING_ADDRESS"] = ! empty($order->billingAddress) ? $this->getAddressData($order->billingAddress) : [];
        $data["PAYMENT_METHOD"] = $this->getOrderPaymentText($orderPayment);

        return $data;
    }

    public function getDataForCustomerPaymentReminder(Order $order):array
    {
        $data = [];

        $paymentPlan = $order->paymentPlan;
        $orderItems = $order->getGroupedOrderItems();

        $data['SUBMISSION_NUMBER'] = $order->order_number;
        $data['CREDIT_APPLIED'] = number_format($order->amount_paid_from_wallet, 2);

        $data['SUBTOTAL'] = number_format($order->service_fee, 2);
        $data['SHIPPING_FEE'] = number_format($order->shipping_fee, 2);
        $data['TOTAL'] = number_format($order->grand_total, 2);

        $data['SERVICE_LEVEL'] = $paymentPlan->price;
        $data['NUMBER_OF_CARDS'] = $orderItems->sum('quantity');
        $data['DATE'] = $order->created_at->format('m/d/Y');

        return $data;
    }

    public function calculateCollectorCoinPrice(
        Order $order,
        int $paymentBlockchainNetwork,
        float $walletAmount = 0.0,
        float $discountedAmount = 0.0,
    ): float {
        $collectorCoinPrice = (new CollectorCoinService)->getCollectorCoinPriceFromUsd(
            $paymentBlockchainNetwork,
            $order->grand_total -
            $this->getCollectorCoinDiscount($order) -
            $walletAmount -
            $discountedAmount -
            $order->refund_total +
            $order->extra_charge_total
        );
        if ($collectorCoinPrice <= 0) {
            return 0.0;
        }

        Cache::put(
            'cc-payment-' . $order->id,
            ['amount' => $collectorCoinPrice, 'network' => $paymentBlockchainNetwork],
            300
        );

        return $collectorCoinPrice;
    }

    protected function getCollectorCoinDiscount(Order $order): float
    {
        return round(
            $order->service_fee * config('robograding.collector_coin_discount_percentage') / 100,
            2
        );
    }

    public function updateBillingAddress(Order $order, array $data): Order
    {
        if ($order->hasSameShippingAndBillingAddresses() || ! $order->hasBillingAddress()) {
            $orderAddress = OrderAddress::create($data);
            $order->billingAddress()->associate($orderAddress);
            $order->save();

            return $order;
        }

        $order->billingAddress->update($data);

        return $order;
    }

    public function processChangeInShippingMethod(Order $order, array $data): Order
    {
        $this->changeShippingMethod($order, $data['shipping_method_id'])
            ->processShippingDetails($order, $data)
            ->updateShippingFee($order)
            ->recalculateGrandTotal($order)
            ->saveOrder($order);

        return $order;
    }

    protected function changeShippingMethod(Order &$order, int $shippingMethodId): self
    {
        $shippingMethod = ShippingMethod::find($shippingMethodId);

        $order->shippingMethod()->associate($shippingMethod);

        return $this;
    }

    protected function updateShippingFee(Order &$order): self
    {
        $order->shipping_fee = $this->getNewShippingFee($order);

        return $this;
    }

    protected function recalculateGrandTotal(Order &$order): self
    {
        $order->grand_total_before_discount = $order->service_fee + $order->shipping_fee;
        $order->grand_total = $order->service_fee + $order->shipping_fee - $order->discounted_amount - $order->payment_method_discounted_amount;

        return $this;
    }

    protected function processShippingDetails(Order &$order, array $data): self
    {
        if ($order->hasInsuredShipping()) {
            if (! empty($data['customer_address']['id'])) {
                $shippingAddress = OrderAddress::create(CustomerAddress::find($data['customer_address']['id'])->toArray());
            } else {
                $shippingAddress = OrderAddress::create($data['shipping_address']);
            }

            $order->shippingAddress()->associate($shippingAddress);
            if (! empty($data['shipping_address']['save_for_later']) && empty($data['customer_address']['id'])) {
                CustomerAddress::create(array_merge(
                    Arr::except($data['shipping_address'], 'save_for_later'),
                    [
                        'user_id' => auth()->user()->id,
                    ]
                ));
            }
        }

        return $this;
    }

    protected function getNewShippingFee(Order $order): float
    {
        return ShippingFeeService::calculateForOrder($order);
    }

    protected function saveOrder(Order &$order): self
    {
        $order->save();

        return $this;
    }

    public function getOrderShippedEmailData(Order $order): array
    {
        if ($order->hasInsuredShipping()) {
            return [
                'data' => [
                    'FIRST_NAME' => $order->user->first_name,
                    'TRACKING_NUMBER' => $order->orderShipment->tracking_number,
                    'TRACKING_URL' => $order->orderShipment->tracking_url,
                ],
                'template' => EmailService::TEMPLATE_SLUG_SUBMISSION_SHIPPED,
            ];
        }

        return [
            'data' => [
                'ORDER_NUMBER' => $order->order_number,
            ],
            'template' => EmailService::TEMPLATE_SLUG_SUBMISSION_IN_VAULT,
        ];
    }
}
