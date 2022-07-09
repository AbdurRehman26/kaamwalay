<?php

use App\Contracts\Services\Admin\Reportable;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderItemStatus;
use App\Models\OrderStatus;
use App\Models\OrderStatusHistory;
use App\Models\User;
use App\Services\Admin\Report\MarketingReport\MarketingMonthlyReport;
use App\Services\Admin\Report\MarketingReport\MarketingQuarterlyReport;
use App\Services\Admin\Report\MarketingReport\MarketingWeeklyReport;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Support\Facades\DB;

use function PHPUnit\Framework\assertFileExists;
use function PHPUnit\Framework\assertTrue;

beforeEach(function () {
    Event::fake();
    Mail::fake();

    $this->date = Carbon::create(2022);

    $this->users = User::factory()->count(4)->create();
});

it('validates reports data for weekly, monthly and quarterly', function ($reportable) {
    $report = $reportable['report'];

    $fromDate = $reportable['fromDate'];
    $toDate = $reportable['toDate'];

    $differenceInDays = $fromDate->diff($toDate)->days;

    foreach ($this->users as $user) {

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
            'created_at' => $order->created_at,
        ]);

        OrderItem::factory()->count(rand(1, 50))->create([
            'order_id' => $order->id,
            'order_item_status_id' => OrderItemStatus::GRADED,
            'created_at' => Carbon::create($this->date)->addDays(rand(1, ($differenceInDays / 2))),
        ]);

        if ($order['order_status_id'] === OrderStatus::SHIPPED) {
            $gradedDate = Carbon::create($order->graded_at);

            $order->shipped_at = $gradedDate->addDays(
                rand(1, $gradedDate->diff($toDate)->days)
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
        'Average order amount' => '$'.(float) number_format(Order::betweenDates($fromDate, $toDate)->avg('grand_total'), 2) ?? 0,
        'Average number of cards graded by all customers' => (int)(OrderItem::graded()->count() / 4),
        'Number of repeat customers' => count(DB::select('select max(id) from orders group by user_id having count(*) > 1')),
        'Number of customers who order 25-50 cards' => $queryCardsCalculation25To50->having(DB::raw('COUNT(order_items.id)'), '>=', 25)->having(DB::raw('COUNT(order_items.id)'), '<', 50)->count(),
        'Number of customers who order 50 - 100 cards' => $queryCardsCalculation50To100->having(DB::raw('COUNT(order_items.id)'), '>=', 50)->having(DB::raw('COUNT(order_items.id)'), '<', 100)->count(),
        'Number of customers that order 100+ cards' => $queryCardsCalculation100->having(DB::raw('COUNT(order_items.id)'), '>=', 100)->count(),
        'Average number of days taken from confirmation to grading' => (int) Order::where('order_status_id', '=', OrderStatus::GRADED)->select(DB::raw("AVG(DATEDIFF(graded_at, created_at)) as avg"))->betweenDates($fromDate, $toDate)->first()->avg  . ' Day(s)',
        'Average number of days taken from confirmation to shipping' => (int) Order::where('order_status_id', '=', OrderStatus::SHIPPED)->select(DB::raw("AVG(DATEDIFF(shipped_at, created_at)) as avg"))->betweenDates($fromDate, $toDate)->first()->avg  . ' Day(s)',
        'Average number of days taken from grading to shipping' => (int) Order::select(DB::raw("AVG(DATEDIFF(shipped_at, graded_at)) as avg"))->betweenDates($fromDate, $toDate)->first()->avg . ' Day(s)',
        'Average time from submission to payment' => (int) Order::select(DB::raw("AVG(DATEDIFF(paid_at, created_at)) as avg"))->betweenDates($fromDate, $toDate)->first()->avg . ' Day(s)',
    ];

    $reportData = $report->getReportData($fromDate, $toDate);

    $this->assertEquals($resultArray, $reportData);
})->with('reportable');

it('checks if template exists', function () {
    $templatePath = head(Config::get('view.paths')) . '/emails/admin/'.$this->report->getTemplate() . '.blade.php';

    assertFileExists($templatePath);
});

it('checks if class implements reportable contract', function () {
    foreach ([
                 resolve(MarketingWeeklyReport::class),
                 resolve(MarketingMonthlyReport::class),
                 resolve(MarketingQuarterlyReport::class)
             ] as $report) {
        assertTrue(
            $report instanceof Reportable
        );
    }

});

dataset('reportable', function () {

    /* Weekly */
    yield function () {
        return [
            'report' => resolve(MarketingWeeklyReport::class),
            'fromDate' => $this->date,
            'toDate' => Carbon::create($this->date)->endOfQuarter(),
        ];
    };

    /* Monthly */
    yield function () {
        return [
            'report' => resolve(MarketingMonthlyReport::class),
            'fromDate' => $this->date,
            'toDate' => Carbon::create($this->date)->endOfMonth(),
        ];
    };

    /* Quarterly */
    yield function () {
        return [
            'report' => resolve(MarketingQuarterlyReport::class),
            'fromDate' => $this->date,
            'toDate' => Carbon::create($this->date)->addWeek()->startOfDay(),
        ];
    };
});
