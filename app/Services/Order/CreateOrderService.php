<?php

namespace App\Services\Order;

use App\Exceptions\API\Customer\Order\OrderNotPlaced;
use App\Models\CustomerAddress;
use App\Models\Order;
use App\Models\Invoice;
use App\Models\OrderAddress;
use App\Models\OrderItem;
use App\Models\OrderPayment;
use App\Models\OrderStatus;
use App\Services\Order\Shipping\ShippingFeeService;
use App\Services\Order\Validators\ItemsDeclaredValueValidator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Services\PDFService;

class CreateOrderService
{
    protected Order $order;
    protected array $data;

    /**
     * @throws OrderNotPlaced
     */
    public function create(array $data): Order
    {
        $this->data = $data;

        try {
            $this->validate();
            $this->process();

            return $this->order;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());

            throw new OrderNotPlaced;
        }
    }

    /**
     * @throws \Exception
     */
    protected function validate()
    {
        ItemsDeclaredValueValidator::validate($this->data);
    }

    protected function process()
    {
        DB::beginTransaction();

        $this->startOrder();
        $this->storePaymentPlan($this->data['payment_plan']);
        $this->storeShippingMethod($this->data['shipping_method']);
        $this->storePaymentMethod($this->data['payment_method']);
        $this->storeOrderAddresses($this->data['shipping_address'], $this->data['billing_address']);
        $this->storeCustomerAddress($this->data['shipping_address']);
        $this->saveOrder();
        $this->storeOrderItems($this->data['items']);
        $this->storeShippingFee();
        $this->storeShippingFeeAndGrandTotal();
        $this->storeOrderPayment($this->data['payment_provider_reference']);

        DB::commit();
        $this->saveInvoicePDF();
    }

    protected function startOrder()
    {
        $this->order = new Order();
    }

    protected function storePaymentPlan(array $paymentPlan)
    {
        $this->order->payment_plan_id = $paymentPlan['id'];
    }

    protected function storeShippingMethod(array $shippingMethod)
    {
        $this->order->shipping_method_id = $shippingMethod['id'];
    }

    protected function storePaymentMethod(array $paymentMethod)
    {
        $this->order->payment_method_id = $paymentMethod['id'];
    }

    protected function storeOrderAddresses(array $shippingAddress, array $billingAddress)
    {
        $shippingAddress = OrderAddress::create($shippingAddress);
        $this->order->shippingAddress()->associate($shippingAddress);

        if ($billingAddress['same_as_shipping']) {
            $this->order->billingAddress()->associate($shippingAddress);
        } else {
            $billingAddress = OrderAddress::create($billingAddress);
            $this->order->billingAddress()->associate($billingAddress);
        }
    }

    protected function storeCustomerAddress(array $shippingAddress)
    {
        if ($shippingAddress['save_for_later']) {
            CustomerAddress::create(array_merge(
                $shippingAddress,
                [
                    'user_id' => auth()->user()->id,
                ]
            ));
        }
    }

    protected function saveOrder()
    {
        $this->order->user()->associate(auth()->user());
        $this->order->order_status_id = OrderStatus::DEFAULT_ORDER_STATUS;
        $this->order->save();
        $this->order->order_number = OrderNumberGeneratorService::generate($this->order);
        $this->order->save();
    }

    protected function storeOrderItems(array $items)
    {
        foreach ($items as $item) {
            OrderItem::create([
                'order_id' => $this->order->id,
                'card_product_id' => $item['card_product']['id'],
                'quantity' => $item['quantity'],
                'declared_value_per_unit' => $item['declared_value_per_unit'],
                'declared_value_total' => $item['quantity'] * $item['declared_value_per_unit'],
            ]);
        }
    }

    protected function storeShippingFee()
    {
        $shippingFee = ShippingFeeService::calculateForOrder($this->order);

        $this->order->shipping_fee = $shippingFee;
        $this->order->save();
    }

    protected function storeShippingFeeAndGrandTotal()
    {
        $this->order->service_fee = $this->order->paymentPlan->price * $this->order->orderItems()->sum('quantity');
        $this->order->grand_total = $this->order->service_fee + $this->order->shipping_fee;
        $this->order->save();
    }

    protected function storeOrderPayment(array $data)
    {
        $response = $this->order->user->findPaymentMethod($data['id']);

        OrderPayment::create([
            'response' => json_encode($response),
            'order_id' => $this->order->id,
            'payment_method_id' => $this->order->paymentMethod->id,
            'payment_provider_reference_id' => $data['id'],
        ]);
    }

    protected function getInvoiceData(){
        $logoContent = file_get_contents(resource_path('assets/logos/invoiceLogo.png'));
        $logoData = 'data:image/png;base64,'.base64_encode($logoContent);

        $agsLogoContent = file_get_contents(resource_path('assets/logos/agsLogo.png'));
        $agsLogo = 'data:image/png;base64,'.base64_encode($agsLogoContent);

        $order = $this->order;
        $orderItems = $order->orderItems;
        $customer = $order->user;
        $shippingAddress = $order->shippingAddress;
        $billingAddress = $order->billingAddress;
        $orderPayment = $order->orderPayment;
        $paymentResponse = $orderPayment ? json_decode($orderPayment->response) : null;
        if($paymentResponse){
            $orderPayment = json_decode(json_encode([
                'card' => [
                    'brand' => $paymentResponse->card->brand,
                    'exp_month' => \Str::padLeft($paymentResponse->card->exp_month,2,'0'),
                    'exp_year' => substr($paymentResponse->card->exp_year,2),
                    'last4' => $paymentResponse->card->last4,
                ],
            ]));
        }
        return [
            'logoData' => $logoData,
            'agsLogo' => $agsLogo,
            'order' => $order,
            'orderItems' => $orderItems,
            'customer' => $customer,
            'shippingAddress' => $shippingAddress,
            'orderPayment' => $orderPayment,
            'billingAddress' => $billingAddress,
        ];
    }
    protected function saveInvoicePDF(){

        $data = $this->getInvoiceData();

        $pdf = PDFService::generate('pdf.invoice',$data);
        \Storage::disk('s3')
            ->put(
                'invoice/invoice-'.$this->order->order_number.'.pdf',
                $pdf->output()
            );
        $url = \Storage::disk('s3')->url('invoice/invoice-'.$this->order->order_number.'.pdf');

        $this->createAndStoreInvoiceRecord($url);
    }

    protected function createAndStoreInvoiceRecord(string $url){
            
        $invoice = new Invoice();
        $invoice->invoice_number = $this->order->order_number;
        $invoice->path = $url;
        $invoice->save();

        $this->order->invoice_id = $invoice->id;
        $this->order->save();
    }
}
