<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AddInitialPaymentPlans extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::table('payment_plans')->insert([
            [
                'price' => 20,
                'max_protection_amount' => 500,
                'turnaround' => '28-30 Day',
                'display_position' => '1',
                'created_at' => new \Datetime(),
                'updated_at' => new \Datetime(),
            ],
            [
                'price' => 50,
                'max_protection_amount' => 500,
                'turnaround' => '12-14 Day',
                'display_position' => '2',
                'created_at' => new \Datetime(),
                'updated_at' => new \Datetime(),
            ],
            [
                'price' => 100,
                'max_protection_amount' => 2500,
                'turnaround' => '5-7 Day',
                'display_position' => '3',
                'created_at' => new \Datetime(),
                'updated_at' => new \Datetime(),
            ],
            [
                'price' => 250,
                'max_protection_amount' => 10000,
                'turnaround' => '2-3 Day',
                'display_position' => '4',
                'created_at' => new \Datetime(),
                'updated_at' => new \Datetime(),
            ],
            [
                'price' => 1000,
                'max_protection_amount' => 50000,
                'turnaround' => '1 Day',
                'display_position' => '5',
                'created_at' => new \Datetime(),
                'updated_at' => new \Datetime(),
            ],
            [
                'price' => 2000,
                'max_protection_amount' => 100000,
                'turnaround' => '1 Day',
                'display_position' => '6',
                'created_at' => new \Datetime(),
                'updated_at' => new \Datetime(),
            ],
            [
                'price' => 5000,
                'max_protection_amount' => 1000000,
                'turnaround' => 'Same Day',
                'display_position' => '7',
                'created_at' => new \Datetime(),
                'updated_at' => new \Datetime(),
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
        DB::table('payment_plans')->truncate();
    }
}
