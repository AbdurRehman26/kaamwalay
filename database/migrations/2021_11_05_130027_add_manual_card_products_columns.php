<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddManualCardProductsColumns extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('card_products', function (Blueprint $table) {
            $table->text('description')->nullable();
            $table->boolean('added_manually')->default(false);
            $table->unsignedBigInteger('added_by')->nullable();

            $table->foreign('added_by')->references('id')->on('users');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('card_products', function (Blueprint $table) {
            $table->dropColumn('description');
            $table->dropColumn('added_manually');

            $table->dropForeign(['added_by']);
            $table->dropColumn('added_by');
        });
    }
}