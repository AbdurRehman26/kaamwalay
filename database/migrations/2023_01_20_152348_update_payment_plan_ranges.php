<?php

use Illuminate\Database\Migrations\Migration;

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

        DB::table('payment_plan_ranges')->where(['id' => 7])->update(['payment_plan_id' => 2, 'min_cards' => 21, 'max_cards' => 50, 'price' => 28,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 8])->update(['payment_plan_id' => 2, 'min_cards' => 51, 'max_cards' => 100, 'price' => 26,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 9])->update(['payment_plan_id' => 2, 'min_cards' => 101, 'max_cards' => 200, 'price' => 24,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 10])->update(['payment_plan_id' => 2, 'min_cards' => 201, 'max_cards' => null, 'price' => 22,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 12])->update(['payment_plan_id' => 3, 'min_cards' => 21, 'max_cards' => 50, 'price' => 45,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 13])->update(['payment_plan_id' => 3, 'min_cards' => 51, 'max_cards' => 100, 'price' => 40,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 14])->update(['payment_plan_id' => 3, 'min_cards' => 101, 'max_cards' => 200, 'price' => 35,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 15])->update(['payment_plan_id' => 3, 'min_cards' => 201, 'max_cards' => null, 'price' => 30,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 17])->update(['payment_plan_id' => 4, 'min_cards' => 21, 'max_cards' => 50, 'price' => 65,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 18])->update(['payment_plan_id' => 4, 'min_cards' => 51, 'max_cards' => 100, 'price' => 60,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 19])->update(['payment_plan_id' => 4, 'min_cards' => 101, 'max_cards' => 200, 'price' => 50,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 20])->update(['payment_plan_id' => 4, 'min_cards' => 201, 'max_cards' => null, 'price' => 40,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 22])->update(['payment_plan_id' => 5, 'min_cards' => 21, 'max_cards' => 50, 'price' => 85,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 23])->update(['payment_plan_id' => 5, 'min_cards' => 51, 'max_cards' => 100, 'price' => 75,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 24])->update(['payment_plan_id' => 5, 'min_cards' => 101, 'max_cards' => 200, 'price' => 65,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 25])->update(['payment_plan_id' => 5, 'min_cards' => 201, 'max_cards' => null, 'price' => 55,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 27])->update(['payment_plan_id' => 6, 'min_cards' => 21, 'max_cards' => 50, 'price' => 175,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 28])->update(['payment_plan_id' => 6, 'min_cards' => 51, 'max_cards' => 100, 'price' => 150,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 29])->update(['payment_plan_id' => 6, 'min_cards' => 101, 'max_cards' => 200, 'price' => 125,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 30])->update(['payment_plan_id' => 6, 'min_cards' => 201, 'max_cards' => null, 'price' => 100,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 32])->update(['payment_plan_id' => 7, 'min_cards' => 21, 'max_cards' => 50, 'price' => 400,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 33])->update(['payment_plan_id' => 7, 'min_cards' => 51, 'max_cards' => 100, 'price' => 350,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 34])->update(['payment_plan_id' => 7, 'min_cards' => 101, 'max_cards' => 200, 'price' => 300,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 35])->update(['payment_plan_id' => 7, 'min_cards' => 201, 'max_cards' => null, 'price' => 250,'updated_at' => $now]);

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        $now = now();

        DB::table('payment_plan_ranges')->where(['id' => 7])->update(['payment_plan_id' => 2, 'min_cards' => 21, 'max_cards' => 50, 'price' => 29,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 8])->update(['payment_plan_id' => 2, 'min_cards' => 51, 'max_cards' => 100, 'price' => 28,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 9])->update(['payment_plan_id' => 2, 'min_cards' => 101, 'max_cards' => 200, 'price' => 27,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 10])->update(['payment_plan_id' => 2, 'min_cards' => 201, 'max_cards' => null, 'price' => 26,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 12])->update(['payment_plan_id' => 3, 'min_cards' => 21, 'max_cards' => 50, 'price' => 49,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 13])->update(['payment_plan_id' => 3, 'min_cards' => 51, 'max_cards' => 100, 'price' => 48,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 14])->update(['payment_plan_id' => 3, 'min_cards' => 101, 'max_cards' => 200, 'price' => 47,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 15])->update(['payment_plan_id' => 3, 'min_cards' => 201, 'max_cards' => null, 'price' => 46,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 17])->update(['payment_plan_id' => 4, 'min_cards' => 21, 'max_cards' => 50, 'price' => 74,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 18])->update(['payment_plan_id' => 4, 'min_cards' => 51, 'max_cards' => 100, 'price' => 73,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 19])->update(['payment_plan_id' => 4, 'min_cards' => 101, 'max_cards' => 200, 'price' => 72,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 20])->update(['payment_plan_id' => 4, 'min_cards' => 201, 'max_cards' => null, 'price' => 71,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 22])->update(['payment_plan_id' => 5, 'min_cards' => 21, 'max_cards' => 50, 'price' => 99,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 23])->update(['payment_plan_id' => 5, 'min_cards' => 51, 'max_cards' => 100, 'price' => 98,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 24])->update(['payment_plan_id' => 5, 'min_cards' => 101, 'max_cards' => 200, 'price' => 97,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 25])->update(['payment_plan_id' => 5, 'min_cards' => 201, 'max_cards' => null, 'price' => 96,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 27])->update(['payment_plan_id' => 6, 'min_cards' => 21, 'max_cards' => 50, 'price' => 199,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 28])->update(['payment_plan_id' => 6, 'min_cards' => 51, 'max_cards' => 100, 'price' => 198,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 29])->update(['payment_plan_id' => 6, 'min_cards' => 101, 'max_cards' => 200, 'price' => 197,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 30])->update(['payment_plan_id' => 6, 'min_cards' => 201, 'max_cards' => null, 'price' => 196,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 32])->update(['payment_plan_id' => 7, 'min_cards' => 21, 'max_cards' => 50, 'price' => 499,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 33])->update(['payment_plan_id' => 7, 'min_cards' => 51, 'max_cards' => 100, 'price' => 498,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 34])->update(['payment_plan_id' => 7, 'min_cards' => 101, 'max_cards' => 200, 'price' => 497,'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 35])->update(['payment_plan_id' => 7, 'min_cards' => 201, 'max_cards' => null, 'price' => 496,'updated_at' => $now]);

    }
};
