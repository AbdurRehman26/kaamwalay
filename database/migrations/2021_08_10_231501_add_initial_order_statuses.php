<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::table('order_statuses')->insert([
            [
                'code' => 'pending_payment',
                'name' => 'Pending Payment',
                'description' => 'Order is pending payment',
                'order_state_id' => 1,
                'created_at' => new Datetime(),
                'updated_at' => new Datetime(),
            ],
            [
                'code' => 'placed',
                'name' => 'Placed',
                'description' => 'Order is paid and placed',
                'order_state_id' => 2,
                'created_at' => new Datetime(),
                'updated_at' => new Datetime(),
            ],
            [
                'code' => 'arrived',
                'name' => 'Arrived',
                'description' => 'Order has arrived at our grading facility',
                'order_state_id' => 2,
                'created_at' => new Datetime(),
                'updated_at' => new Datetime(),
            ],
            [
                'code' => 'graded',
                'name' => 'Graded',
                'description' => 'Order has been graded by us',
                'order_state_id' => 2,
                'created_at' => new Datetime(),
                'updated_at' => new Datetime(),
            ],
            [
                'code' => 'shipped',
                'name' => 'Shipped',
                'description' => 'Order has been shipped back to customer after grading',
                'order_state_id' => 4,
                'created_at' => new Datetime(),
                'updated_at' => new Datetime(),
            ],
            [
                'code' => 'cancelled',
                'name' => 'Cancelled',
                'description' => 'Order has been cancelled',
                'order_state_id' => 3,
                'created_at' => new Datetime(),
                'updated_at' => new Datetime(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::table('order_statuses')->truncate();
    }
};
