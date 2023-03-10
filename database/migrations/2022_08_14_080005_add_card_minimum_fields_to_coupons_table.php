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
        Schema::table('coupons', function (Blueprint $table) {
            $table->integer('min_threshold_value')
                ->after('capped_amount')
                ->default(0)
                ->comment('when 0 it means no threshold');
            $table->tinyInteger('min_threshold_type')
                ->after('capped_amount')
                ->default(0)
                ->comment('0 => No threshold, 1 => card count, 2 => amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('coupons', function (Blueprint $table) {
            $table->dropColumn(['min_threshold_value', 'min_threshold_type']);
        });
    }
};
