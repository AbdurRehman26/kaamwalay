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
        $now = now();

        DB::table('payment_plans')->where(['id' => 1])->update(['turnaround' => '20-25 Business Days', 'updated_at' => $now]);
        DB::table('payment_plans')->where(['id' => 2])->update(['turnaround' => '12-15 Business Days', 'updated_at' => $now]);
        DB::table('payment_plans')->where(['id' => 3])->update(['turnaround' => '5-7 Business Days', 'updated_at' => $now]);
        DB::table('payment_plans')->where(['id' => 4])->update(['turnaround' => '2-3 Business Days', 'updated_at' => $now]);
        DB::table('payment_plans')->where(['id' => 5])->update(['turnaround' => 'Same Business Day', 'updated_at' => $now]);
        DB::table('payment_plans')->where(['id' => 6])->update(['turnaround' => 'Same Business Day', 'updated_at' => $now]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        $now = now();

        DB::table('payment_plans')->where(['id' => 1])->update(['turnaround' => '20-25 Days', 'updated_at' => $now]);
        DB::table('payment_plans')->where(['id' => 2])->update(['turnaround' => '12-15 Days', 'updated_at' => $now]);
        DB::table('payment_plans')->where(['id' => 3])->update(['turnaround' => '5-7 Days', 'updated_at' => $now]);
        DB::table('payment_plans')->where(['id' => 4])->update(['turnaround' => '2-3 Days', 'updated_at' => $now]);
        DB::table('payment_plans')->where(['id' => 5])->update(['turnaround' => 'Same Day', 'updated_at' => $now]);
        DB::table('payment_plans')->where(['id' => 6])->update(['turnaround' => 'Same Day', 'updated_at' => $now]);
    }
};
