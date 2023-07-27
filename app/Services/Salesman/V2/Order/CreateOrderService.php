<?php

namespace App\Services\Salesman\V2\Order;

use App\Events\API\Customer\Order\OrderPlaced;
use App\Exceptions\API\Admin\OrderStatusHistoryWasAlreadyAssigned;
use App\Models\Country;
use App\Models\CustomerAddress;
use App\Models\Order;
use App\Models\OrderPaymentPlan;
use App\Models\OrderStatus;
use App\Models\PaymentPlan;
use App\Models\User;
use App\Services\Order\OrderNumberGeneratorService;
use App\Services\Order\V2\CreateOrderService as BaseCreateOrderService;
use App\Services\Order\Validators\AdminCustomerAddressValidator;
use App\Services\Order\Validators\CouponAppliedValidator;
use App\Services\Order\Validators\ItemsDeclaredValueValidator;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class CreateOrderService extends BaseCreateOrderService
{
    protected User $orderUser;

    /**
     * @throws Exception
     * @throws Throwable
     */
    public function create(array $data): Order
    {
        $this->data = $data;

        $this->orderUser = User::find($this->data['user_id']);

        try {
            $this->validate();
            $this->process();

            return $this->order;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage()."\n File:".$e->getFile()."\n Line:".$e->getLine());

            throw $e;
        }
    }

    /**
     * @throws Exception
     */
    protected function validate(): void
    {
        ItemsDeclaredValueValidator::validate($this->data);
        AdminCustomerAddressValidator::validate($this->data);
        CouponAppliedValidator::validate($this->data);
    }

    /**
     * @throws Throwable
     * @throws OrderStatusHistoryWasAlreadyAssigned
     */
    protected function process(): void
    {
        DB::beginTransaction();

        $this->startOrder();
        $this->storePaymentPlan($this->data['payment_plan']);
        $this->storeShippingMethod($this->data['shipping_method']);
        if ($this->order->hasInsuredShipping()) {
            $this->storeOrderAddresses($this->data['shipping_address'], $this->data['billing_address'], $this->data['customer_address']);
            $this->storeCustomerAddress($this->data['shipping_address'], $this->data['customer_address']);
        }
        $this->saveOrder();
        $this->storeOrderItems($this->data['items']);
        $this->storeShippingFee();
        $this->storeServiceFee();
        $this->storeCleaningFee();
        $this->storeShippingInsuranceFee();
        $this->storeCouponAndDiscount(! empty($this->data['coupon']) ? $this->data['coupon'] : []);
        $this->storeGrandTotal();
        $this->associateSalesman();

        $this->orderStatusHistoryService->addStatusToOrder(OrderStatus::PLACED, $this->order);
        OrderPlaced::dispatch($this->order);

        DB::commit();
    }

    protected function storeCustomerAddress(array $shippingAddress, array $customerAddress): void
    {
        if ($shippingAddress['save_for_later'] && empty($customerAddress['id'])) {
            $shippingAddress['country_id'] = Country::whereCode($shippingAddress['country_code'] ?? 'US')->first()->id;
            CustomerAddress::create(array_merge(
                $shippingAddress,
                [
                    'user_id' => $this->orderUser->id,
                ]
            ));
        }
    }

    protected function saveOrder(): void
    {
        $this->order->user()->associate($this->orderUser);
        $this->order->createdBy()->associate(auth()->user());
        $this->order->save();
        $this->order->order_number = OrderNumberGeneratorService::generate($this->order);
        $this->order->save();
    }

    protected function storePaymentPlan(array $paymentPlan): void
    {
        // This payment_plan_id is linked to originalPaymentPlan relationship
        $this->order->payment_plan_id = $paymentPlan['id'];

        $paymentPlan = PaymentPlan::find($paymentPlan['id']);
        $priceRanges = $paymentPlan->paymentPlanRanges;

        // @phpstan-ignore-next-line
        $totalItems = collect($this->data['items'])->sum('quantity');

        $priceRange = $priceRanges->first(function ($item, $key) use ($totalItems) {
            return ($item->min_cards <= $totalItems && $item->max_cards >= $totalItems) ||
                ($item->min_cards <= $totalItems && ! $item->max_cards);
        });

        $orderPaymentPlan = OrderPaymentPlan::create([
            'price' => $priceRange ? $priceRange->price : $paymentPlan->price,
            'max_protection_amount' => $paymentPlan->max_protection_amount,
            'turnaround' => $paymentPlan->turnaround,
        ]);

        // Column for paymentPlan relationship is order_payment_plan_id
        $this->order->paymentPlan()->associate($orderPaymentPlan);
    }
}
