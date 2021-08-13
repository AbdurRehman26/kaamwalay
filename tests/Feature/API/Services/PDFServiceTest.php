<?php
namespace Tests\Unit\API\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Services\PDFService;
use Tests\TestCase;

class PDFServiceTest extends TestCase
{
    /** @test */
    public function it_can_generate_pdf()
    {
        $order = Order::factory()->create();
        $customer = $order->user;
        $shipping = $order->shippingAddress;
        $billing = $order->billingAddress;

        $data = [
            'logoData' => '',
            'agsLogo' => '',
            'barcode' => '',
            'order' => $order,
            'orderItems' => collect(new OrderItem),
            'customer' => $customer,
            'shippingAddress' => $shipping,
            'orderPayment' => null,
            'billingAddress' => $billing,
        ];

        $pdf = PDFService::generate('pdf.invoice', $data);

        $this->assertTrue($pdf instanceof \Barryvdh\DomPDF\PDF);
    }
}
