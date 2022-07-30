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
        Schema::table('payment_plans', function (Blueprint $table) {
            $table->string('estimated_delivery_days')->nullable()->after('turnaround');
        });

        $now = now();

        DB::table('payment_plans')->where(['id' => 1])->update(['estimated_delivery_days' => '20-25', 'updated_at' => $now]);
        DB::table('payment_plans')->where(['id' => 2])->update(['estimated_delivery_days' => '12-15', 'updated_at' => $now]);
        DB::table('payment_plans')->where(['id' => 3])->update(['estimated_delivery_days' => '5-7', 'updated_at' => $now]);
        DB::table('payment_plans')->where(['id' => 4])->update(['estimated_delivery_days' => '2-3', 'updated_at' => $now]);
        DB::table('payment_plans')->where(['id' => 5])->update(['estimated_delivery_days' => '1-1', 'updated_at' => $now]);
        DB::table('payment_plans')->where(['id' => 6])->update(['estimated_delivery_days' => '1-1', 'updated_at' => $now]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('payment_plans', function (Blueprint $table) {
            $table->dropColumn('estimated_delivery_days');
        });
    }
};
