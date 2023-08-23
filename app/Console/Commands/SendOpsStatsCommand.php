<?php

namespace App\Console\Commands;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderItemStatus;
use App\Models\OrderStatus;
use App\Notifications\OpsStatsNotification;
use Illuminate\Console\Command;
use Illuminate\Contracts\Console\PromptsForMissingInput;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class SendOpsStatsCommand extends Command implements PromptsForMissingInput
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ops:send-stats {startDateTime : YYYY-MM-DD H:m:s format} {endDateTime : YYYY-MM-DD H:m:s format}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send OPS stats e.g. Total shipped orders, Total graded cards, etc.';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $starDateTime = Carbon::parse($this->argument('startDateTime'));
        $endDateTime = Carbon::parse($this->argument('endDateTime'));

        $opsStats = [
            'date' => $starDateTime->format('m/d/y'),
            'total_shipped_orders' => $this->getTotalShippedOrders($starDateTime, $endDateTime),
            'total_cards_in_shipped_orders' => $this->getTotalCardsInShippedOrders($starDateTime, $endDateTime),
            'total_graded_cards' => $this->getTotalGradedCards($starDateTime, $endDateTime),
            'total_reviewed_cards' => $this->getTotalReviewedCards($starDateTime, $endDateTime),
            'total_graded_cards_by_grader' => $this->getTotalGradedCardsByGrader($starDateTime, $endDateTime),
            'total_reviewed_cards_by_reviewer' => $this->getTotalReviewedCardsByReviewer($starDateTime, $endDateTime),
        ];

        Notification::route('slack', config('services.slack.channel_webhooks.ops_ags'))
            ->notify(new OpsStatsNotification($opsStats));

        return 0;
    }

    protected function getTotalShippedOrders(Carbon $starDateTime, Carbon $endDateTime): int
    {
        return Order::status(OrderStatus::SHIPPED)->whereBetween('shipped_at', [$starDateTime, $endDateTime])->count();
    }

    /**
     * Total graded cards from orders which are shipped
     */
    protected function getTotalCardsInShippedOrders(Carbon $starDateTime, Carbon $endDateTime): int
    {
        return OrderItem::join('orders', 'orders.id', 'order_items.order_id')
            ->join('order_item_status_histories', 'order_item_status_histories.order_item_id', 'order_items.id')
            ->where('orders.order_status_id', OrderStatus::SHIPPED)
            ->where('order_item_status_histories.order_item_status_id', OrderItemStatus::GRADED)
            ->whereBetween('orders.shipped_at', [$starDateTime, $endDateTime])
            ->count();
    }

    protected function getTotalGradedCards(Carbon $starDateTime, Carbon $endDateTime): int
    {
        return $this->getTotalCardsByStatus($starDateTime, $endDateTime, OrderItemStatus::GRADED);
    }

    protected function getTotalReviewedCards(Carbon $starDateTime, Carbon $endDateTime): int
    {
        return $this->getTotalCardsByStatus($starDateTime, $endDateTime, OrderItemStatus::CONFIRMED);
    }

    /**
     * @return Collection<int,OrderItem>
     */
    protected function getTotalGradedCardsByGrader(Carbon $starDateTime, Carbon $endDateTime): Collection
    {
        return $this->getCardsBreakdownByUser($starDateTime, $endDateTime, OrderItemStatus::GRADED);
    }

    /**
     * @return Collection<int,OrderItem>
     */
    protected function getTotalReviewedCardsByReviewer(Carbon $starDateTime, Carbon $endDateTime): Collection
    {
        return $this->getCardsBreakdownByUser($starDateTime, $endDateTime, OrderItemStatus::CONFIRMED);
    }

    protected function getTotalCardsByStatus(Carbon $starDateTime, Carbon $endDateTime, int $orderItemStatus): int
    {
        return OrderItem::join('order_item_status_histories', 'order_item_status_histories.order_item_id',
            'order_items.id')
            ->where('order_item_status_histories.order_item_status_id', $orderItemStatus)
            ->whereBetween('order_item_status_histories.created_at', [$starDateTime, $endDateTime])
            ->count();
    }

    /**
     * @return Collection<int,OrderItem>
     */
    protected function getCardsBreakdownByUser(Carbon $starDateTime, Carbon $endDateTime, int $orderItemStatus): Collection
    {
        return OrderItem::join('order_item_status_histories', 'order_item_status_histories.order_item_id',
            'order_items.id')
            ->join('users', 'users.id', 'order_item_status_histories.user_id')
            ->where('order_item_status_histories.order_item_status_id', $orderItemStatus)
            ->whereBetween('order_item_status_histories.created_at', [$starDateTime, $endDateTime])
            ->groupBy('order_item_status_histories.user_id')
            ->select([
                DB::raw('CONCAT(users.first_name, " ", users.last_name) as full_name'),
                DB::raw('COUNT(order_item_status_histories.id) as total'),
            ])->orderByDesc('total')
            ->get();
    }

    /**
     * Prompt for missing input arguments using the returned questions.
     */
    protected function promptForMissingArgumentsUsing(): array
    {
        return [
            'startDateTime' => ['What is start date time?', 'E.g. 2023-08-22 13:00:00'],
            'endDateTime' => ['What is end date time?', 'E.g. 2023-08-23 13:59:59'],
        ];
    }
}
