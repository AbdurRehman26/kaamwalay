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
