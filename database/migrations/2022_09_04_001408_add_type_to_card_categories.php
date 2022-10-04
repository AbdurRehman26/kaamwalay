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
        Schema::table('card_categories', function (Blueprint $table) {
            $table->unsignedBigInteger('card_category_type_id')->nullable()->after('is_enabled');
            $table->foreign('card_category_type_id')->references('id')->on('card_category_types');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('card_categories', function (Blueprint $table) {
            $table->dropForeign(['card_category_type_id']);
            $table->dropColumn('card_category_type_id');
        });
    }
};
