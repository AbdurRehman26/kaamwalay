<?php

use Illuminate\Database\Migrations\Migration;
use Carbon\Carbon;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $newPricings = [
            ['id' => 1, 'price' => 20, 'max_protection_amount' => 500, 'turnaround' => '20-25 Days', 'display_position' => 1],
            ['id' => 2, 'price' => 40, 'max_protection_amount' => 1000, 'turnaround' => '12-15 Days', 'display_position' => 2],
            ['id' => 3, 'price' => 60, 'max_protection_amount' => 2500, 'turnaround' => '5-7 Days', 'display_position' => 3],
            ['id' => 4, 'price' => 100, 'max_protection_amount' => 10000, 'turnaround' => '2-3 Days', 'display_position' => 4],
            ['id' => 5, 'price' => 200, 'max_protection_amount' => 50000, 'turnaround' => 'Same Day', 'display_position' => 5],
            ['id' => 6, 'price' => 1000, 'max_protection_amount' => 250000, 'turnaround' => 'Same Day', 'display_position' => 6],
        ];

        DB::table('payment_plans')->upsert($newPricings, ['id'], ['price', 'max_protection_amount', 'turnaround']);

        DB::table('payment_plans')->where('id', 7)->update(['deleted_at' => Carbon::now()->toDateTimeString()]);

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
};
