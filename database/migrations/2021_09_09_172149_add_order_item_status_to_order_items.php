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
        Schema::disableForeignKeyConstraints();

        Schema::table('order_items', function (Blueprint $table) {
            $table->foreignId('order_item_status_id')->default(1)->constrained();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::disableForeignKeyConstraints();

        Schema::table('order_items', function (Blueprint $table) {

            $table->dropForeign('order_items_order_item_status_id_foreign');
            $table->dropIndex('order_items_order_item_status_id_foreign');
            $table->dropColumn('order_item_status_id');

        });

        Schema::enableForeignKeyConstraints();
    }
};
