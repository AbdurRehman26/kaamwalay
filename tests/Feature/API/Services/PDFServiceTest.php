<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Services\PDFService;
use Carbon\Carbon;

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

    expect($pdf)->toBeInstanceOf(\Barryvdh\DomPDF\PDF::class);
});
