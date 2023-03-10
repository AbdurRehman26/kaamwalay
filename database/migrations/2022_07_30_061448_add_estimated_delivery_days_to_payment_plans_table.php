<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('payment_plans', function (Blueprint $table) {
            $table->integer('estimated_delivery_days_min')->nullable()->after('turnaround');
            $table->integer('estimated_delivery_days_max')->nullable()->after('estimated_delivery_days_min');
        });

        $now = now();

        DB::table('payment_plans')->where(['id' => 1])->update(['estimated_delivery_days_min' => 20, 'estimated_delivery_days_max' => 25, 'updated_at' => $now]);
        DB::table('payment_plans')->where(['id' => 2])->update(['estimated_delivery_days_min' => 12, 'estimated_delivery_days_max' => 15, 'updated_at' => $now]);
        DB::table('payment_plans')->where(['id' => 3])->update(['estimated_delivery_days_min' => 5, 'estimated_delivery_days_max' => 7, 'updated_at' => $now]);
        DB::table('payment_plans')->where(['id' => 4])->update(['estimated_delivery_days_min' => 2, 'estimated_delivery_days_max' => 3, 'updated_at' => $now]);
        DB::table('payment_plans')->where(['id' => 5])->update(['estimated_delivery_days_min' => 1, 'estimated_delivery_days_max' => 1, 'updated_at' => $now]);
        DB::table('payment_plans')->where(['id' => 6])->update(['estimated_delivery_days_min' => 1, 'estimated_delivery_days_max' => 1, 'updated_at' => $now]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payment_plans', function (Blueprint $table) {
            $table->dropColumn('estimated_delivery_days_min');
            $table->dropColumn('estimated_delivery_days_max');
        });
    }
};
