<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('order_statuses', function (Blueprint $table) {
            DB::table('order_statuses')->where('code', 'reviewed')->update([
                'code' => 'assembled',
                'name' => 'Assembled',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_statuses', function (Blueprint $table) {
            DB::table('order_statuses')->where('code', 'assembled')->update([
                'code' => 'reviewed',
                'name' => 'Reviewed',
            ]);
        });
    }
};
