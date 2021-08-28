<?php

namespace Tests\Unit\API\Services\Order;

use App\Models\Order;
use App\Models\OrderPayment;
use App\Services\Order\RevenueStatsService;
use App\Services\Payment\PaymentService;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RevenueStatsServiceTest extends TestCase
{
    use RefreshDatabase;

    protected RevenueStatsService $revenueStatsService;
    protected PaymentService $paymentService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->revenueStatsService = new RevenueStatsService();
        $this->paymentService = new PaymentService();

        $this->order = Order::factory()->state(new Sequence(
            ['payment_method_id' => 1]
        ))->create();

        $this->orderPayment = OrderPayment::factory()->for($this->order)->stripe()->create();

        $this->paymentService->calculateAndSaveFee($this->orderPayment->order);
    }

    /**
     * @test
     * @group revenue stats
     */
    public function it_adds_revenue_stats()
    {
        $profit = ($this->order->service_fee - $this->order->orderPayment->provider_fee);
        $revenue = $this->order->grand_total;
        $revenueStats = $this->revenueStatsService->addStats(Carbon::now()->toDateString());
        $this->assertSame($revenueStats['revenue'], $revenue);
        $this->assertSame($revenueStats['profit'], $profit);
    }
}
