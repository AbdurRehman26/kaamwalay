<?php

namespace App\Console\Commands;

use App\Models\OrderItem;
use App\Models\OrderItemStatus;
use App\Models\OrderItemStatusHistory;
use App\Models\User;
use App\Services\Admin\Order\OrderItemService;
use Illuminate\Console\Command;

class InitializeOrderItemsAsPending extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'order:initialize-items-pending';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Initialize existing order items to pending status.';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(protected OrderItemService $orderItemService)
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $items = OrderItem::all();
        $this->info('Total items: ' . count($items));
        foreach ($items as $item) {
            $this->info('Processing item: '. $item->id);

            $status = new OrderItemStatusHistory();
            $status->order_item_id = $item->id;
            $status->order_item_status_id = OrderItemStatus::PENDING;
            $status->user_id = User::find(1);
            $status->save();

            $this->info('Created status: ' . $status->id);

            $item->order_item_status_id = OrderItemStatus::PENDING;
            $item->save();
        }
    }
}
