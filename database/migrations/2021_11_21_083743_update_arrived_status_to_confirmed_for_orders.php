<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateArrivedStatusToConfirmedForOrders extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::table('order_statuses')
            ->where('code', 'arrived')
            ->update([
                'code' => 'confirmed',
                'name' => 'Confirmed',
                'description' => 'Order has arrived and confirmed at our grading facility',
            ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
