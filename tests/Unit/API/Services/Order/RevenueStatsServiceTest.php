<?php

use App\Models\Order;
use App\Models\OrderPayment;
use App\Services\Order\RevenueStatsService;
use App\Services\Payment\PaymentService;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class);
uses(RefreshDatabase::class);

beforeEach(function () {
    $this->revenueStatsService = new RevenueStatsService();
    $this->paymentService = new PaymentService();

    $this->order = Order::factory()->state(new Sequence(
        ['payment_method_id' => 1, 'order_status_id' => 2]
    ))->create();

    $this->orderPayment = OrderPayment::factory()->for($this->order)->stripe()->create();

    $this->paymentService->calculateAndSaveFee($this->orderPayment->order);
});

it('adds revenue stats', function () {
    $profit = ($this->order->service_fee - $this->order->orderPayment->provider_fee);
    $revenue = $this->order->grand_total;
    $revenueStats = $this->revenueStatsService->addStats(Carbon::now()->toDateString());
    expect($revenue)->toBe($revenueStats['revenue']);
    expect($profit)->toBe($revenueStats['profit']);
})->group('revenue-stats');
