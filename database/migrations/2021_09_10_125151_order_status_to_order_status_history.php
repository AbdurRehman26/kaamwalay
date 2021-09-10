<?php

use App\Exceptions\API\Admin\OrderStatusHistoryWasAlreadyAssigned;
use App\Services\Admin\OrderStatusHistoryService;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class OrderStatusToOrderStatusHistory extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     * @throws Throwable
     * @throws OrderStatusHistoryWasAlreadyAssigned
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('order_status_id')->nullable()->change();
        });

        /**
         * @var OrderStatusHistoryService $orderStatusHistoryService
         */
        $orderStatusHistoryService = resolve(OrderStatusHistoryService::class);
        $orders = DB::select('SELECT id, user_id, order_status_id FROM orders');

        foreach ($orders as $order) {
            for ($orderStatusId = $order['order_status_id']; $orderStatusId >= 1; $orderStatusId++) {
                $orderStatusHistoryService->addStatusToOrder($order['id'], $orderStatusId);
            }
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        // Nothing
    }
}
