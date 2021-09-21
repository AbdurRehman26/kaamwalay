<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddShipmentProviderToOrderItemShipment extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('order_item_shipments', function (Blueprint $table) {
            $table->string('shipping_provider')->nullable()->after('tracking_url');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('order_item_shipments', function (Blueprint $table) {
            $table->dropColumn('shipping_provider');
        });
    }
}
