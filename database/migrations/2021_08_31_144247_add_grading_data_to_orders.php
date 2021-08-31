<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddGradingDataToOrders extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->text('notes')->nullable();
            $table->foreignId('order_admin_status_id')->default(1)->constrained();
            $table->unsignedBigInteger('reviewed_by_id')->nullable();
            $table->unsignedBigInteger('graded_by_id')->nullable();

            $table->foreign('reviewed_by_id')->references('id')->on('users');
            $table->foreign('graded_by_id')->references('id')->on('users');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('notes');

            $table->dropForeign('orders_order_admin_status_id_foreign');
            $table->dropIndex('orders_order_admin_status_id_foreign');
            $table->dropColumn('order_admin_status_id');

            $table->dropForeign('orders_reviewed_by_id_foreign');
            $table->dropIndex('orders_reviewed_by_id_foreign');
            $table->dropColumn('reviewed_by_id');

            $table->dropForeign('orders_graded_by_id_foreign');
            $table->dropIndex('orders_graded_by_id_foreign');
            $table->dropColumn('graded_by_id');
        });
    }
}
