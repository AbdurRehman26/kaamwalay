<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $now = now();

        DB::table('payment_plan_ranges')->where(['id' => 1])->update(['price' => 14, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 2])->update(['price' => 13, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 3])->update(['price' => 12, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 4])->update(['price' => 11, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 5])->update(['price' => 10, 'updated_at' => $now]);

        DB::table('payment_plan_ranges')->where(['id' => 6])->update(['price' => 20, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 7])->update(['price' => 19, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 8])->update(['price' => 18, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 9])->update(['price' => 17, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 10])->update(['price' => 16, 'updated_at' => $now]);

        DB::table('payment_plan_ranges')->where(['id' => 11])->update(['price' => 30, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 12])->update(['price' => 29, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 13])->update(['price' => 28, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 14])->update(['price' => 27, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 15])->update(['price' => 26, 'updated_at' => $now]);

        DB::table('payment_plan_ranges')->where(['id' => 16])->update(['price' => 50, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 17])->update(['price' => 45, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 18])->update(['price' => 42, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 19])->update(['price' => 40, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 20])->update(['price' => 38, 'updated_at' => $now]);

        DB::table('payment_plan_ranges')->where(['id' => 21])->update(['price' => 75, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 22])->update(['price' => 65, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 23])->update(['price' => 60, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 24])->update(['price' => 55, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 25])->update(['price' => 50, 'updated_at' => $now]);

        DB::table('payment_plan_ranges')->where(['id' => 26])->update(['price' => 100, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 27])->update(['price' => 85, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 28])->update(['price' => 75, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 29])->update(['price' => 70, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 30])->update(['price' => 65, 'updated_at' => $now]);

        DB::table('payment_plan_ranges')->where(['id' => 31])->update(['price' => 200, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 32])->update(['price' => 175, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 33])->update(['price' => 150, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 34])->update(['price' => 125, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 35])->update(['price' => 100, 'updated_at' => $now]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $now = now();

        DB::table('payment_plan_ranges')->where(['id' => 1])->update(['price' => 18, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 2])->update(['price' => 17, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 3])->update(['price' => 16, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 4])->update(['price' => 15, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 5])->update(['price' => 14, 'updated_at' => $now]);

        DB::table('payment_plan_ranges')->where(['id' => 6])->update(['price' => 30, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 7])->update(['price' => 28, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 8])->update(['price' => 26, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 9])->update(['price' => 24, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 10])->update(['price' => 22, 'updated_at' => $now]);

        DB::table('payment_plan_ranges')->where(['id' => 11])->update(['price' => 50, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 12])->update(['price' => 45, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 13])->update(['price' => 40, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 14])->update(['price' => 35, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 15])->update(['price' => 30, 'updated_at' => $now]);

        DB::table('payment_plan_ranges')->where(['id' => 16])->update(['price' => 75, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 17])->update(['price' => 65, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 18])->update(['price' => 60, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 19])->update(['price' => 50, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 20])->update(['price' => 40, 'updated_at' => $now]);

        DB::table('payment_plan_ranges')->where(['id' => 21])->update(['price' => 100, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 22])->update(['price' => 85, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 23])->update(['price' => 75, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 24])->update(['price' => 65, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 25])->update(['price' => 55, 'updated_at' => $now]);

        DB::table('payment_plan_ranges')->where(['id' => 26])->update(['price' => 200, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 27])->update(['price' => 175, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 28])->update(['price' => 150, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 29])->update(['price' => 125, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 30])->update(['price' => 100, 'updated_at' => $now]);

        DB::table('payment_plan_ranges')->where(['id' => 31])->update(['price' => 500, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 32])->update(['price' => 400, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 33])->update(['price' => 350, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 34])->update(['price' => 300, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 35])->update(['price' => 250, 'updated_at' => $now]);
    }
};
