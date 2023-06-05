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

        DB::table('payment_plan_ranges')->where(['id' => 1])->update(['max_cards' => 99, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 2])->update(['min_cards' => 100, 'max_cards' => null, 'price' => 13, 'updated_at' => $now]);

        DB::table('payment_plan_ranges')->where(['id' => 6])->update(['max_cards' => 99, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 7])->update(['min_cards' => 100, 'max_cards' => null, 'price' => 19, 'updated_at' => $now]);

        DB::table('payment_plan_ranges')->where(['id' => 11])->update(['max_cards' => 99, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 12])->update(['min_cards' => 100, 'max_cards' => null, 'price' => 29, 'updated_at' => $now]);

        DB::table('payment_plan_ranges')->where(['id' => 16])->update(['max_cards' => 99, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 17])->update(['min_cards' => 100, 'max_cards' => null, 'price' => 49, 'updated_at' => $now]);

        DB::table('payment_plan_ranges')->where(['id' => 21])->update(['max_cards' => 99, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 22])->update(['min_cards' => 100, 'max_cards' => null, 'price' => 74, 'updated_at' => $now]);

        DB::table('payment_plan_ranges')->where(['id' => 26])->update(['max_cards' => 99, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 27])->update(['min_cards' => 100, 'max_cards' => null, 'price' => 99, 'updated_at' => $now]);

        DB::table('payment_plan_ranges')->where(['id' => 31])->update(['max_cards' => 99, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 32])->update(['min_cards' => 100, 'max_cards' => null, 'price' => 199, 'updated_at' => $now]);

        DB::table('payment_plan_ranges')->whereIn('id', [3, 4, 5, 8, 9, 10, 13, 14, 15, 18, 19, 20, 23, 24, 25, 28, 29, 30, 33, 34, 35])->delete();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $now = now();

        DB::table('payment_plan_ranges')->where(['id' => 1])->update(['max_cards' => 20, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 2])->update(['min_cards' => 21, 'max_cards' => 50, 'price' => 13, 'updated_at' => $now]);

        DB::table('payment_plan_ranges')->where(['id' => 6])->update(['max_cards' => 20, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 7])->update(['min_cards' => 21, 'max_cards' => 50, 'price' => 19, 'updated_at' => $now]);

        DB::table('payment_plan_ranges')->where(['id' => 11])->update(['max_cards' => 20, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 12])->update(['min_cards' => 21, 'max_cards' => 50, 'price' => 29, 'updated_at' => $now]);

        DB::table('payment_plan_ranges')->where(['id' => 16])->update(['max_cards' => 20, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 17])->update(['min_cards' => 21, 'max_cards' => 50, 'price' => 45, 'updated_at' => $now]);

        DB::table('payment_plan_ranges')->where(['id' => 21])->update(['max_cards' => 20, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 22])->update(['min_cards' => 21, 'max_cards' => 50, 'price' => 65, 'updated_at' => $now]);

        DB::table('payment_plan_ranges')->where(['id' => 26])->update(['max_cards' => 20, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 27])->update(['min_cards' => 21, 'max_cards' => 50, 'price' => 85, 'updated_at' => $now]);

        DB::table('payment_plan_ranges')->where(['id' => 31])->update(['max_cards' => 20, 'updated_at' => $now]);
        DB::table('payment_plan_ranges')->where(['id' => 32])->update(['min_cards' => 21, 'max_cards' => 50, 'price' => 175, 'updated_at' => $now]);

        DB::table('payment_plan_ranges')->insert([
            ['id' => 3, 'payment_plan_id' => 1, 'min_cards' => 51, 'max_cards' => 100, 'price' => 12, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 4, 'payment_plan_id' => 1, 'min_cards' => 101, 'max_cards' => 200, 'price' => 11, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 5, 'payment_plan_id' => 1, 'min_cards' => 201, 'max_cards' => null, 'price' => 10, 'created_at' => $now, 'updated_at' => $now],

            ['id' => 8, 'payment_plan_id' => 2, 'min_cards' => 51, 'max_cards' => 100, 'price' => 18, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 9, 'payment_plan_id' => 2, 'min_cards' => 101, 'max_cards' => 200, 'price' => 17, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 10, 'payment_plan_id' => 2, 'min_cards' => 201, 'max_cards' => null, 'price' => 16, 'created_at' => $now, 'updated_at' => $now],

            ['id' => 13, 'payment_plan_id' => 3, 'min_cards' => 51, 'max_cards' => 100, 'price' => 28, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 14, 'payment_plan_id' => 3, 'min_cards' => 101, 'max_cards' => 200, 'price' => 27, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 15, 'payment_plan_id' => 3, 'min_cards' => 201, 'max_cards' => null, 'price' => 26, 'created_at' => $now, 'updated_at' => $now],

            ['id' => 18, 'payment_plan_id' => 4, 'min_cards' => 51, 'max_cards' => 100, 'price' => 42, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 19, 'payment_plan_id' => 4, 'min_cards' => 101, 'max_cards' => 200, 'price' => 40, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 20, 'payment_plan_id' => 4, 'min_cards' => 201, 'max_cards' => null, 'price' => 38, 'created_at' => $now, 'updated_at' => $now],

            ['id' => 23, 'payment_plan_id' => 5, 'min_cards' => 51, 'max_cards' => 100, 'price' => 60, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 24, 'payment_plan_id' => 5, 'min_cards' => 101, 'max_cards' => 200, 'price' => 55, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 25, 'payment_plan_id' => 5, 'min_cards' => 201, 'max_cards' => null, 'price' => 50, 'created_at' => $now, 'updated_at' => $now],

            ['id' => 28, 'payment_plan_id' => 2, 'min_cards' => 51, 'max_cards' => 100, 'price' => 75, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 29, 'payment_plan_id' => 2, 'min_cards' => 101, 'max_cards' => 200, 'price' => 70, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 30, 'payment_plan_id' => 2, 'min_cards' => 201, 'max_cards' => null, 'price' => 65, 'created_at' => $now, 'updated_at' => $now],

            ['id' => 33, 'payment_plan_id' => 2, 'min_cards' => 51, 'max_cards' => 100, 'price' => 150, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 34, 'payment_plan_id' => 2, 'min_cards' => 101, 'max_cards' => 200, 'price' => 125, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 35, 'payment_plan_id' => 2, 'min_cards' => 201, 'max_cards' => null, 'price' => 100, 'created_at' => $now, 'updated_at' => $now],
        ]);
    }
};
