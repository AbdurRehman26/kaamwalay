<?php

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

    $queryCardsConfirmationToNextStatus = Order::join('order_status_histories', 'order_status_histories.order_id', '=', 'orders.id')
        ->where('order_status_histories.order_status_id', '=', OrderStatus::CONFIRMED);

    $queryCardsConfirmationToGrading = clone $queryCardsConfirmationToNextStatus;

    $resultArray = [
        'Average order amount' => '$'.(float) number_format(Order::betweenDates($fromDate, $toDate)->avg('grand_total'), 2) ?? 0,
        'Average number of cards graded by all customers' => (int)(OrderItem::count() / 4),
        'Number of repeat customers' => Order::selectRaw('MAX(id)')->groupBy('user_id')->having(DB::raw('COUNT(user_id)'), '>', 1)->count(),
        'Number of customers who order 25-50 cards' => $queryCardsCalculation25To50->having(DB::raw('COUNT(order_items.id)'), '>=', 25)->having(DB::raw('COUNT(order_items.id)'), '<', 50)->count(),
        'Number of customers who order 50 - 100 cards' => $queryCardsCalculation50To100->having(DB::raw('COUNT(order_items.id)'), '>=', 50)->having(DB::raw('COUNT(order_items.id)'), '<', 100)->count(),
        'Number of customers that order 100+ cards' => $queryCardsCalculation100->having(DB::raw('COUNT(order_items.id)'), '>=', 100)->count(),
        'Average number of days taken from confirmation to grading' => (int) $queryCardsConfirmationToGrading->select(DB::raw("AVG(DATEDIFF(orders.graded_at, order_status_histories.created_at)) as avg"))
        ->where('orders.order_status_id', '>=', OrderStatus::GRADED)
        ->whereBetween("orders.graded_at", [$fromDate, $toDate])
        ->first()->avg . ' Day(s)',

        'Average number of days taken from confirmation to shipping' => (int) $queryCardsConfirmationToGrading->select(DB::raw("AVG(DATEDIFF(orders.shipped_at, order_status_histories.created_at)) as avg"))
            ->where('orders.order_status_id', '>=', OrderStatus::SHIPPED)
            ->whereBetween("orders.shipped_at", [$fromDate, $toDate])
            ->first()->avg . ' Day(s)',

        'Average number of days taken from grading to shipping' => (int) Order::select(DB::raw("AVG(DATEDIFF(shipped_at, graded_at)) as avg"))->betweenDates($fromDate, $toDate)->first()->avg . ' Day(s)',
        'Average time from submission to payment' => (int) Order::select(DB::raw("AVG(DATEDIFF(paid_at, created_at)) as avg"))->betweenDates($fromDate, $toDate)->first()->avg . ' Day(s)',
    ];

    $reportData = $report->getDataForReport($fromDate, $toDate);

    expect($reportData)->toBe($resultArray);

})->with('reportable');

it('checks if template exists', function () {
    $report = resolve(MarketingQuarterlyReport::class);

    expect(View::exists('emails.admin.reports.' . $report->getTemplate()))->toBeTrue();
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
