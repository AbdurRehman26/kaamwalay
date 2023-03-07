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
    public function up(): void
    {
        Schema::table('coupon_stats', function (Blueprint $table) {
            $table->unsignedInteger('total_cards')
                ->default(0)->after('times_used');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::table('coupon_stats', function (Blueprint $table) {
            $table->dropColumn('total_cards');
        });
    }
};
