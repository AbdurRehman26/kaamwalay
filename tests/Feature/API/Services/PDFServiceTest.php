<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Services\PDFService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class);
uses(RefreshDatabase::class);

it('can generate pdf', function () {
    $order = Order::factory()->create();
    $customer = $order->user;
    $shipping = $order->shippingAddress;
    $billing = $order->billingAddress;

    $data = [
        'logoData' => '',
        'agsLogo' => '',
        'barcode' => '',
        'order' => $order,
        'orderDate' => Carbon::parse($order->created_at)->format('m/d/Y'),
        'orderItems' => collect(new OrderItem),
        'customer' => $customer,
        'shippingAddress' => $shipping,
        'orderPayment' => null,
        'billingAddress' => $billing,
    ];

    $pdf = PDFService::generate('pdf.invoice', $data);

    $this->assertInstanceOf(\Barryvdh\DomPDF\PDF::class, $pdf);
});
