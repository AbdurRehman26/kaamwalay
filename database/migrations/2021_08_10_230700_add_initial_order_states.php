<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class AddInitialOrderStates extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::table('order_states')->insert([
            [
                'code' => 'new',
                'description' => 'Order is in initial state',
                'created_at' => new \Datetime(),
                'updated_at' => new \Datetime(),
            ],
            [
                'code' => 'processing',
                'description' => 'Order is processing',
                'created_at' => new \Datetime(),
                'updated_at' => new \Datetime(),
            ],
            [
                'code' => 'cancelled',
                'description' => 'Order is cancelled',
                'created_at' => new \Datetime(),
                'updated_at' => new \Datetime(),
            ],
            [
                'code' => 'complete',
                'description' => 'Order is complete',
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
        DB::table('order_states')->truncate();
    }
}
