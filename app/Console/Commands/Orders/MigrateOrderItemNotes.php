<?php

namespace App\Console\Commands\Orders;

use App\Models\OrderItemStatusHistory;
use Illuminate\Console\Command;

class MigrateOrderItemNotes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'order-items:migrate-notes';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command will migrate the notes from status histories table to the order_items table';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    public function handle(): void
    {
        $this->info('Starting to migrate notes from order item status histories to order items');

        OrderItemStatusHistory::query()
            ->whereNotNull('notes')
            ->with('orderItem:id,notes')
            ->get()
            ->each(function (OrderItemStatusHistory $statusHistory) {
                if (empty($statusHistory->orderItem->notes)) {
                    $statusHistory->orderItem->update([
                        'notes' => $statusHistory->notes,
                    ]);
                }
            });

        $this->info('Migrated all the notes');
    }
}
