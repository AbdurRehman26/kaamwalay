<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderItemStatus;
use App\Models\OrderStatus;
use App\Models\OrderStatusHistory;
use App\Models\User;
use App\Services\Report\Contracts\Reportable;
use App\Services\Report\StatsReportService;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Support\Facades\DB;

beforeEach(function () {
    Event::fake();
    Mail::fake();

    $this->date = Carbon::create(2022);

    $this->report = resolve(StatsReportService::class);

    $this->users = User::factory()->count(4)->create();

});

it('validates reports data for weekly', function ($intervalDates) {

    $differenceInDays = $intervalDates['fromDate']->diff($intervalDates['toDate'])->days;

    $fromDate = $intervalDates['fromDate'];
    $toDate = $intervalDates['toDate'];

    foreach ($this->users as $user){

        /* Four graded orders */
        /* Four shipped orders */

        Order::factory()->count(8)->state(new Sequence(
            [
                'order_status_id' => OrderStatus::GRADED,
                'user_id' => $user->id,
            ],
            [
                'order_status_id' => OrderStatus::SHIPPED,
                'user_id' => $user->id,
            ],
        ))->create([
            'grand_total' => rand(100, 4000),
            'created_at' => Carbon::create($this->date)->addDays(rand(1, ($differenceInDays / 2))),
            'graded_at' => Carbon::create($this->date)->addDays(rand(($differenceInDays / 2), $differenceInDays)),
        ]);

    }

    foreach (Order::all() as $order) {
        $order->markAsPaid();

        OrderStatusHistory::create([
            'user_id' => $order->user->id,
            'order_status_id' => OrderStatus::CONFIRMED,
            'order_id' => $order->id,
            'created_at' => $order->created_at
        ]);

        OrderItem::factory()->count(rand(1, 50))->create([
            'order_id' => $order->id,
            'order_item_status_id' => OrderItemStatus::GRADED,
            'created_at' => Carbon::create($this->date)->addDays(rand(1, ($differenceInDays / 2))),
        ]);

        if($order['order_status_id'] === OrderStatus::SHIPPED){
            $gradedDate = Carbon::create($order->graded_at);

            $order->shipped_at = $gradedDate->addDays(
                rand(1, $gradedDate->diff($intervalDates['toDate'])->days)
            );
            $order->save();
        }
    }

    $queryCardsCalculation25To50 = Order::selectRaw('MAX(orders.user_id)')
        ->join('order_items', 'orders.id', '=', 'order_items.order_id')
        ->whereBetween('orders.created_at', [$fromDate, $toDate])
        ->groupBy('orders.user_id');

    $queryCardsCalculation50To100 = clone $queryCardsCalculation25To50;
    $queryCardsCalculation100 = clone $queryCardsCalculation25To50;

    $resultArray = [
        'Average order amount' => (float) number_format(Order::betweenDates($fromDate, $toDate)->arePaid()->avg('grand_total'), 2) ?? 0,
        'Average number of cards graded by all customers' => (int)(OrderItem::graded()->count() / 4),
        'Number of repeat customers' => count(DB::select('select max(id) from orders group by user_id having count(*) > 1')),
        'Number of customers who order 25-50 cards' => $queryCardsCalculation25To50->having(DB::raw('COUNT(order_items.id)'), '>=', 25)->having(DB::raw('COUNT(order_items.id)'), '<', 50)->count(),
        'Number of customers who order 50 - 100 cards' => $queryCardsCalculation50To100->having(DB::raw('COUNT(order_items.id)'), '>=', 50)->having(DB::raw('COUNT(order_items.id)'), '<', 100)->count(),
        'Number of customers that order 100+ cards' => $queryCardsCalculation100->having(DB::raw('COUNT(order_items.id)'), '>=', 100)->count(),
        'Average number of days taken from confirmation to grading' => (int) Order::where('order_status_id', '=', OrderStatus::GRADED)->select(DB::raw("AVG(DATEDIFF(graded_at, created_at)) as avg"))->betweenDates($fromDate, $toDate)->first()->avg,
        'Average number of days taken from confirmation to shipping' => (int) Order::where('order_status_id', '=', OrderStatus::SHIPPED)->select(DB::raw("AVG(DATEDIFF(shipped_at, created_at)) as avg"))->betweenDates($fromDate, $toDate)->first()->avg,
        'Average number of days taken from grading to shipping' => (int) Order::select(DB::raw("AVG(DATEDIFF(shipped_at, graded_at)) as avg"))->betweenDates($fromDate, $toDate)->first()->avg,
        'Average time from submission to payment' => (int) Order::select(DB::raw("AVG(DATEDIFF(paid_at, created_at)) as avg"))->betweenDates($fromDate, $toDate)->first()->avg,
    ];

    $reportData = $this->report->getReportData($fromDate, $toDate);

    $this->assertEquals($resultArray, $reportData);

})->with('intervalDates');

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

it('isEligibleToBeSentQuarterly returns true if its first day of the quarter', function () {
    Carbon::setTestNow(Carbon::create(now()->firstOfQuarter()));

    self::assertTrue(
        $this->report->isEligibleToBeSentQuarterly()
    );
});


dataset('intervalDates', function (){

    yield function (){
        return [
            'fromDate' => $this->date,
            'toDate' => Carbon::create($this->date)->addWeek()->startOfDay()
        ];
    };
    yield function (){
        return [
            'fromDate' => $this->date,
            'toDate' => Carbon::create($this->date)->endOfQuarter()
        ];
    };
    yield function (){
        return [
            'fromDate' => $this->date,
            'toDate' => Carbon::create($this->date)->endOfYear()
        ];
    };
});
