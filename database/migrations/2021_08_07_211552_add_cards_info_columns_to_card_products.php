<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCardsInfoColumnsToCardProducts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();
        
        Schema::table('card_products', function (Blueprint $table) {
            $table->foreignId('card_set_id')->constrained()->nullable();
            $table->foreignId('card_category_id')->constrained()->nullable();
            $table->string('rarity')->nullable();
            $table->string('card_number')->nullable();
            $table->string('image_path',1000)->nullable();
            $table->string('card_url',1000)->nullable();
            $table->string('image_bucket_path',1000)->nullable();
            $table->string('card_number_order')->nullable();

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
        Schema::table('card_products', function (Blueprint $table) {

            $table->dropForeign('card_products_card_category_id_foreign');
            $table->dropIndex('card_products_card_category_id_foreign');

            $table->dropForeign('card_products_card_set_id_foreign');
            $table->dropIndex('card_products_card_set_id_foreign');

            $table->dropColumn('card_set_id');
            $table->dropColumn('card_category_id');
            $table->dropColumn('rarity');
            $table->dropColumn('card_number');
            $table->dropColumn('image_path');
            $table->dropColumn('card_url');
            $table->dropColumn('image_bucket_path');
            $table->dropColumn('card_number_order');
        });
    }
}
