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
        $now = now();
        
        DB::table('payment_plan_ranges')->insert([
            ['payment_plan_id' => 1, 'min_cards' => 1, 'max_cards' => 20, 'price' => 18, 'created_at' => $now, 'updated_at' => $now],
            ['payment_plan_id' => 1, 'min_cards' => 21, 'max_cards' => 50, 'price' => 17, 'created_at' => $now, 'updated_at' => $now],
            ['payment_plan_id' => 1, 'min_cards' => 51, 'max_cards' => 100, 'price' => 16, 'created_at' => $now, 'updated_at' => $now],
            ['payment_plan_id' => 1, 'min_cards' => 101, 'max_cards' => 200, 'price' => 15, 'created_at' => $now, 'updated_at' => $now],
            ['payment_plan_id' => 1, 'min_cards' => 201, 'max_cards' => null, 'price' => 14, 'created_at' => $now, 'updated_at' => $now],
            ['payment_plan_id' => 2, 'min_cards' => 1, 'max_cards' => 20, 'price' => 30, 'created_at' => $now, 'updated_at' => $now],
            ['payment_plan_id' => 2, 'min_cards' => 21, 'max_cards' => 50, 'price' => 29, 'created_at' => $now, 'updated_at' => $now],
            ['payment_plan_id' => 2, 'min_cards' => 51, 'max_cards' => 100, 'price' => 28, 'created_at' => $now, 'updated_at' => $now],
            ['payment_plan_id' => 2, 'min_cards' => 101, 'max_cards' => 200, 'price' => 27, 'created_at' => $now, 'updated_at' => $now],
            ['payment_plan_id' => 2, 'min_cards' => 201, 'max_cards' => null, 'price' => 26, 'created_at' => $now, 'updated_at' => $now],
            ['payment_plan_id' => 3, 'min_cards' => 1, 'max_cards' => 20, 'price' => 50, 'created_at' => $now, 'updated_at' => $now],
            ['payment_plan_id' => 3, 'min_cards' => 21, 'max_cards' => 50, 'price' => 49, 'created_at' => $now, 'updated_at' => $now],
            ['payment_plan_id' => 3, 'min_cards' => 51, 'max_cards' => 100, 'price' => 48, 'created_at' => $now, 'updated_at' => $now],
            ['payment_plan_id' => 3, 'min_cards' => 101, 'max_cards' => 200, 'price' => 47, 'created_at' => $now, 'updated_at' => $now],
            ['payment_plan_id' => 3, 'min_cards' => 201, 'max_cards' => null, 'price' => 46, 'created_at' => $now, 'updated_at' => $now],
            ['payment_plan_id' => 4, 'min_cards' => 1, 'max_cards' => 20, 'price' => 75, 'created_at' => $now, 'updated_at' => $now],
            ['payment_plan_id' => 4, 'min_cards' => 21, 'max_cards' => 50, 'price' => 74, 'created_at' => $now, 'updated_at' => $now],
            ['payment_plan_id' => 4, 'min_cards' => 51, 'max_cards' => 100, 'price' => 73, 'created_at' => $now, 'updated_at' => $now],
            ['payment_plan_id' => 4, 'min_cards' => 101, 'max_cards' => 200, 'price' => 72, 'created_at' => $now, 'updated_at' => $now],
            ['payment_plan_id' => 4, 'min_cards' => 201, 'max_cards' => null, 'price' => 71, 'created_at' => $now, 'updated_at' => $now],
            ['payment_plan_id' => 5, 'min_cards' => 1, 'max_cards' => 20, 'price' => 100, 'created_at' => $now, 'updated_at' => $now],
            ['payment_plan_id' => 5, 'min_cards' => 21, 'max_cards' => 50, 'price' => 99, 'created_at' => $now, 'updated_at' => $now],
            ['payment_plan_id' => 5, 'min_cards' => 51, 'max_cards' => 100, 'price' => 98, 'created_at' => $now, 'updated_at' => $now],
            ['payment_plan_id' => 5, 'min_cards' => 101, 'max_cards' => 200, 'price' => 97, 'created_at' => $now, 'updated_at' => $now],
            ['payment_plan_id' => 5, 'min_cards' => 201, 'max_cards' => null, 'price' => 96, 'created_at' => $now, 'updated_at' => $now],
            ['payment_plan_id' => 6, 'min_cards' => 1, 'max_cards' => 20, 'price' => 200, 'created_at' => $now, 'updated_at' => $now],
            ['payment_plan_id' => 6, 'min_cards' => 21, 'max_cards' => 50, 'price' => 199, 'created_at' => $now, 'updated_at' => $now],
            ['payment_plan_id' => 6, 'min_cards' => 51, 'max_cards' => 100, 'price' => 198, 'created_at' => $now, 'updated_at' => $now],
            ['payment_plan_id' => 6, 'min_cards' => 101, 'max_cards' => 200, 'price' => 197, 'created_at' => $now, 'updated_at' => $now],
            ['payment_plan_id' => 6, 'min_cards' => 201, 'max_cards' => null, 'price' => 196, 'created_at' => $now, 'updated_at' => $now],
            ['payment_plan_id' => 7, 'min_cards' => 1, 'max_cards' => 20, 'price' => 500, 'created_at' => $now, 'updated_at' => $now],
            ['payment_plan_id' => 7, 'min_cards' => 21, 'max_cards' => 50, 'price' => 499, 'created_at' => $now, 'updated_at' => $now],
            ['payment_plan_id' => 7, 'min_cards' => 51, 'max_cards' => 100, 'price' => 498, 'created_at' => $now, 'updated_at' => $now],
            ['payment_plan_id' => 7, 'min_cards' => 101, 'max_cards' => 200, 'price' => 497, 'created_at' => $now, 'updated_at' => $now],
            ['payment_plan_id' => 7, 'min_cards' => 201, 'max_cards' => null, 'price' => 496, 'created_at' => $now, 'updated_at' => $now],
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::table('payment_plan_ranges')->truncate();
    }
};
