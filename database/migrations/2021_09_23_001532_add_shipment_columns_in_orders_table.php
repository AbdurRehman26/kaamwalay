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
            $table->after('invoice_id', function ($table) {
                $table->foreignId('order_shipment_id')->nullable()->constrained();
                $table->foreignId('order_customer_shipment_id')->nullable()->constrained();
            });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['order_shipment_id']);
            $table->dropColumn('order_shipment_id');
            $table->dropForeign(['order_customer_shipment_id']);
            $table->dropColumn('order_customer_shipment_id');
        });
    }
};
