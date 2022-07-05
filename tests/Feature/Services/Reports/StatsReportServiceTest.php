<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatus;
use App\Models\User;
use App\Services\Report\Contracts\Reportable;
use App\Services\Report\StatsReportService;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Sequence;

beforeEach(function () {

    Event::fake();
    Mail::fake();

    $this->report = resolve(StatsReportService::class);

    $user = User::factory()->create();

    $this->orders = Order::factory()->count(2)->withPayment()->state(new Sequence(
        [
            'user_id' => $user->id,
            'order_status_id' => OrderStatus::PLACED,
            'created_at' => Carbon::create(2022),
            'grand_total' => 100
        ],
        [
            'user_id' => $user->id,
            'order_status_id' => OrderStatus::PLACED,
            'created_at' => Carbon::create(2022),
            'grand_total' => 200
        ],
    ))->create();

    $this->orders->each(function (Order $order){
        $order->markAsPaid();
    });

});

it('checks if template exists', function () {

    $templatePath = head(Config::get('view.paths')) . '/emails/admin/'.$this->report->getTemplate() . '.blade.php';

    self::assertFileExists($templatePath);

});

it('checks if class implements reportable contract', function () {

    self::assertTrue(
        $this->report instanceof Reportable
    );

});

it('isEligibleToBeSentWeekly returns true if its Monday', function () {

    Carbon::setTestNow(Carbon::create(now()->firstWeekDay));

    self::assertTrue(
        $this->report->isEligibleToBeSentWeekly()
    );

});

it('isEligibleToBeSentMonthly returns true if its first day of the month', function () {

    Carbon::setTestNow(Carbon::create(now()->firstOfMonth()));

    self::assertTrue(
        $this->report->isEligibleToBeSentMonthly()
    );

});

it('isEligibleToBeSentYearly returns true if its first day of the month', function () {

    Carbon::setTestNow(Carbon::create(now()->firstOfYear()));

    self::assertTrue(
        $this->report->isEligibleToBeSentYearly()
    );

});

it('validates reports data for weekly', function () {

    $resultArray = [
        'Average order amount' => $this->orders->avg('grand_total'),
        'Average number of cards graded by all customers' => (OrderItem::count() / 2),
        'Number of repeat customers' => 2,
        'Number of customers who order 25-50 cards' => 1,
        'Number of customers who order 50 - 100 cards' => 1,
        'Number of customers that order 100+ cards' => 1,
        'Average number of days taken from confirmation to grading' => 2,
        'Average number of days taken from confirmation to shipping' => 2,
        'Average number of days taken from grading to shipping' => 2,
        'Average time from submission to payment' => 2,
    ];

    $reportData = $this->report->getReportData(Carbon::create(2022), Carbon::create(2022, 1, 7));

});
