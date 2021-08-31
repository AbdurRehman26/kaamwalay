<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class);
uses(RefreshDatabase::class);

beforeEach(function () {
    $this->shippingProvider = 'fedex';
    $this->trackingNumber = '020207021381215';

    $this->orderItem = OrderItem::factory()->create();
    $this->order = $this->orderItem->order;
});

test('a customer can update order shipment details', function () {
    $this->actingAs($this->order->user);

    $response = $this->postJson('/api/customer/orders/'.$this->order->id.'/customer-shipment', [
        'shipping_provider' => $this->shippingProvider,
        'tracking_number' => $this->trackingNumber,
    ]);

    $response->assertOk();
    $response->assertJsonStructure([
        'data' => ['customer_shipment' => ['tracking_number', 'shipping_provider']],
    ]);
});

test('a guest cannot update order shipment details', function () {
    $response = $this->postJson('/api/customer/orders/'.$this->order->id.'/customer-shipment', [
        'shipping_provider' => $this->shippingProvider,
        'tracking_number' => $this->trackingNumber,
    ]);

    $response->assertUnauthorized();
});

test('a customer cannot update order shipment details from other user', function () {
    /** @var User $otherCustomer */
    $otherCustomer = User::factory()->create();

    $this->actingAs($otherCustomer);

    $response = $this->postJson('/api/customer/orders/'.$this->order->id.'/customer-shipment', [
        'shipping_provider' => $this->shippingProvider,
        'tracking_number' => $this->trackingNumber,
    ]);

    $response->assertForbidden();
});
