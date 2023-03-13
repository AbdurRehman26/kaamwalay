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
        Schema::table('order_item_shipments', function (Blueprint $table) {
            $table->string('shipping_provider')->nullable()->after('tracking_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_item_shipments', function (Blueprint $table) {
            $table->dropColumn('shipping_provider');
        });
    }
};
