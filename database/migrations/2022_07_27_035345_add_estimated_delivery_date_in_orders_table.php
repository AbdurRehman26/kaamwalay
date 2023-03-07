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
        Schema::table('orders', function (Blueprint $table) {
            $table->timestamp('estimated_delivery_start_at')->nullable()->after('arrived_at');
            $table->timestamp('estimated_delivery_end_at')->nullable()->after('estimated_delivery_start_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('estimated_delivery_start_at');
            $table->dropColumn('estimated_delivery_end_at');
        });
    }
};
