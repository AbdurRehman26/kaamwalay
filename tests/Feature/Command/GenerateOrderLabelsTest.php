<?php

use App\Exceptions\Services\AGS\AgsServiceIsDisabled;
use App\Exceptions\Services\AGS\OrderLabelCouldNotBeGeneratedException;
use App\Models\Order;
use App\Models\OrderStatus;

use function Pest\Laravel\assertDatabaseHas;

beforeEach(function () {
    Storage::fake('s3');
    config(['services.ags.is_platform_enabled' => true]);
});

it('generates order label for specific order', function () {
    Http::fake([
        'ags.api/card-labels/' => Http::response(json_decode(file_get_contents(
            base_path() . '/tests/stubs/AGS_create_card_label_response_200.json'
        ), associative: true)),
    ]);
    $order = Order::factory()->create(['order_status_id' => OrderStatus::GRADED]);

    $this->artisan('orders:generate-label ' . $order->order_number)->assertExitCode(0);
    assertDatabaseHas('order_labels', ['order_id' => $order->id]);
});

it('generates order label for already graded orders', function () {
    Http::fake([
        'ags.api/card-labels/' => Http::response(json_decode(file_get_contents(
            base_path() . '/tests/stubs/AGS_create_card_label_response_200.json'
        ), associative: true)),
    ]);
    $orders = Order::factory()->count(2)->create(['order_status_id' => OrderStatus::GRADED]);
    $this->artisan('orders:generate-label')->assertExitCode(0);
    assertDatabaseHas('order_labels', ['order_id' => $orders->first()->id]);
});

it('throws exception if AGS service is disabled', function () {
    Order::factory()->create(['order_status_id' => OrderStatus::GRADED]);
    config(['services.ags.is_platform_enabled' => false]);
    $this->artisan('orders:generate-label');
})->throws(AgsServiceIsDisabled::class);

it('throws exception if AGS responds with error', function () {
    Http::fake([
        'ags.api/card-labels/' => Http::response(json_decode(file_get_contents(
            base_path() . '/tests/stubs/AGS_create_card_label_error_response_404.json'
        ), associative: true)),
    ]);
    $order = Order::factory()->create(['order_status_id' => OrderStatus::GRADED]);

    $this->artisan('orders:generate-label ' . $order->order_number)->assertExitCode(0);
})->throws(OrderLabelCouldNotBeGeneratedException::class);
