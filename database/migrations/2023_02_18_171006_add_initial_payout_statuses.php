<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::table('payout_statuses')->insert([
            [
                'code' => 'pending',
                'name' => 'Pending',
                'description' => '',
                'created_at' => new Datetime(),
                'updated_at' => new Datetime(),
            ],
            [
                'code' => 'processing',
                'name' => 'Processing',
                'description' => '',
                'created_at' => new Datetime(),
                'updated_at' => new Datetime(),
            ],
            [
                'code' => 'completed',
                'name' => 'Completed',
                'description' => '',
                'created_at' => new Datetime(),
                'updated_at' => new Datetime(),
            ],
            [
                'code' => 'failed',
                'name' => 'Failed',
                'description' => '',
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
        DB::table('order_item_statuses')->truncate();
    }
};
