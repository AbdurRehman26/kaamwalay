<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderItemStatus;
use App\Models\OrderStatus;
use App\Models\User;
use App\Services\Admin\Order\OrderItemService;
use App\Services\Report\Contracts\Reportable;
use App\Services\Report\StatsReportService;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Support\Facades\DB;

beforeEach(function () {

    Event::fake();
    Mail::fake();


    $this->daysDifference = [
        1, 2, 3, 4
    ];

    $this->orderItemService = resolve(OrderItemService::class);

    $this->firstDay = Carbon::create(2022);
    $this->lastDayOfWeek = Carbon::create(2022, 1, 7);

    $date = Carbon::create(2022, 1, 2);

    $this->report = resolve(StatsReportService::class);

    $users = User::factory()->count(3)->create();

    $this->gradedOrders = Order::factory()->count(4)->state(new Sequence(
        [
            'user_id' => $users->first()->id,
            'grand_total' => 100,
            'graded_at' => Carbon::now()->addDays($this->daysDifference[0]),
        ],
        [
            'user_id' => $users->first()->id,
            'grand_total' => 100,
            'graded_at' => Carbon::now()->addDays($this->daysDifference[1]),
        ],
        [
            'user_id' => $users[1]->id,
            'grand_total' => 200,
            'graded_at' => Carbon::now()->addDays($this->daysDifference[2]),
        ],
        [
            'user_id' => $users->last()->id,
            'grand_total' => 100,
            'graded_at' => Carbon::now()->addDays($this->daysDifference[3]),
        ],
    ))->withConfirmationOrderStatusHistory(OrderStatus::CONFIRMED)->create([
        'created_at' => $date,
        'order_status_id' => OrderStatus::GRADED
    ]);

    $cardsToBeGraded = [
        26,
        55,
        106,
        26
    ];

    foreach ($this->gradedOrders as $key =>  $order){

        $order->markAsPaid();

        OrderItem::factory()->count($cardsToBeGraded[$key])->state( new Sequence(
            [
                'order_id' => $order->id,
                'order_item_status_id' => OrderItemStatus::GRADED,
                'created_at' => $date,
            ]
        ))->create();
    }


    $this->shippedOrders = Order::factory()->count(4)->state(new Sequence(
        [
            'user_id' => $users->first()->id,
            'grand_total' => 100,
            'graded_at' => Carbon::now()->addDays($this->daysDifference[0]),
            'shipped_at' => Carbon::now()->addDays($this->daysDifference[0] * 2),
        ],
        [
            'user_id' => $users->first()->id,
            'grand_total' => 100,
            'graded_at' => Carbon::now()->addDays($this->daysDifference[1]),
            'shipped_at' => Carbon::now()->addDays($this->daysDifference[1] * 2),
        ],
        [
            'user_id' => $users[1]->id,
            'grand_total' => 200,
            'graded_at' => Carbon::now()->addDays($this->daysDifference[2]),
            'shipped_at' => Carbon::now()->addDays($this->daysDifference[2] * 2),
        ],
        [
            'user_id' => $users->last()->id,
            'grand_total' => 100,
            'graded_at' => Carbon::now()->addDays($this->daysDifference[3]),
            'shipped_at' => Carbon::now()->addDays($this->daysDifference[3] * 2),
        ],
    ))->withConfirmationOrderStatusHistory(OrderStatus::CONFIRMED)->create([
        'created_at' => $date,
        'order_status_id' => OrderStatus::SHIPPED
    ]);

});

it('validates reports data for weekly', function () {

    $resultArray = [
        'Average order amount' => Order::all()->avg('grand_total'),
        'Average number of cards graded by all customers' => (OrderItem::graded()->count() / 3),
        'Number of repeat customers' => count(DB::select('select max(id) from orders group by user_id having count(*) > 1')),
        'Number of customers who order 25-50 cards' => 1,
        'Number of customers who order 50 - 100 cards' => 1,
        'Number of customers that order 100+ cards' => 1,
        'Average number of days taken from confirmation to grading' => array_sum($this->daysDifference) / Order::where('order_status_id', OrderStatus::GRADED)->count(),
        'Average number of days taken from confirmation to shipping' => (float) (array_sum($this->daysDifference) * 2) / Order::where('order_status_id', OrderStatus::SHIPPED)->count(),
        'Average number of days taken from grading to shipping' => (float) DB::table('orders')->selectRaw('AVG(DATEDIFF(shipped_at, graded_at)) as avg')->first()->avg,
        'Average time from submission to payment' => (int) Order::select(DB::raw("AVG(DATEDIFF(paid_at, created_at)) as avg"))->first()->avg,
    ];

    $reportData = $this->report->getReportData($this->firstDay, $this->lastDayOfWeek);

    $this->assertEquals($resultArray, $reportData);
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

it('isEligibleToBeSentYearly returns true if its first day of the quarter', function () {
    Carbon::setTestNow(Carbon::create(now()->firstOfYear()));

    self::assertTrue(
        $this->report->isEligibleToBeSentQuarterly()
    );
});
