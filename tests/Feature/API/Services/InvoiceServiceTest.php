<?php

namespace Tests\Feature\API\Services;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

use App\Models\CardProduct;
use App\Models\Order;
use App\Models\User;
use App\Models\PaymentMethod;
use App\Models\PaymentPlan;
use App\Models\ShippingMethod;
use App\Services\Payment\InvoiceService;
use App\Services\PDFService;
use App\Models\CustomerAddress;

class InvoiceServiceTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected PaymentPlan $paymentPlan;
    protected CardProduct $cardProduct;
    protected ShippingMethod $shippingMethod;
    protected PaymentMethod $paymentMethod;
    protected CustomerAddress $customerAddress;

    protected function setUp(): void
    {
        parent::setUp();
        $this->customerAddress = CustomerAddress::factory()->create();
        $this->user = $this->customerAddress->user;
        $this->paymentPlan = PaymentPlan::factory()->create();
        $this->cardProduct = CardProduct::factory()->create();
        $this->shippingMethod = ShippingMethod::factory()->create();
        $this->paymentMethod = PaymentMethod::factory()->create();
    }

    /** @test */
    public function order_invoice_is_generated()
    {
        $this->actingAs($this->user);

        $response = $this->postJson('/api/customer/orders/', [
            'payment_plan' => [
                'id' => $this->paymentPlan->id,
            ],
            'items' => [
                [
                    'card_product' => [
                        'id' => $this->cardProduct->id,
                    ],
                    'quantity' => 1,
                    'declared_value_per_unit' => 500,
                ],
                [
                    'card_product' => [
                        'id' => $this->cardProduct->id,
                    ],
                    'quantity' => 1,
                    'declared_value_per_unit' => 500,
                ],
            ],
            'shipping_address' => [
                'first_name' => 'First',
                'last_name' => 'Last',
                'address' => 'Test address',
                'city' => 'Test',
                'state' => 'AB',
                'zip' => '12345',
                'phone' => '1234567890',
                'flat' => '43',
                'save_for_later' => true,
            ],
            'billing_address' => [
                'first_name' => 'First',
                'last_name' => 'Last',
                'address' => 'Test address',
                'city' => 'Test',
                'state' => 'AB',
                'zip' => '12345',
                'phone' => '1234567890',
                'flat' => '43',
                'same_as_shipping' => true,
            ],
            'shipping_method' => [
                'id' => $this->shippingMethod->id,
            ],
            'payment_method' => [
                'id' => $this->paymentMethod->id,
            ],
            'customer_address' => [
                'id' => $this->customerAddress->id,
            ],
            'payment_provider_reference' => [
                'id' => 'pm_1JOC5XJCai8r8pbf1AaP079z',
            ]
        ]);
        
        $response->assertStatus(201);
        $response->assertJsonStructure([
            'data' => ['id', 'order_number'],
        ]);
        
        $responseObj = json_decode($response->getContent());
        
        $order = Order::find($responseObj->data->id);
        $customer = $order->user;
        $shipping = $order->shippingAddress;
        $billing = $order->billingAddress;

        $data = [
            'logoData' => '',
            'agsLogo' => '',
            'barcode' => '',
            'order' => $order,
            'orderItems' => $order->orderItems,
            'customer' => $order->user,
            'shippingAddress' => $order->shippingAddress,
            'orderPayment' => $order->orderPayment,
            'billingAddress' => $order->billingAddress,
        ];

        $pdf = PDFService::generate('pdf.invoice', $data);
    
        $this->assertTrue($pdf instanceof \Barryvdh\DomPDF\PDF);

    }

}
