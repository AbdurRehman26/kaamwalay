<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCardProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('card_products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('card_set_id')->nullable()->constrained();
            $table->foreignId('card_category_id')->nullable()->constrained();
            $table->string('rarity')->nullable();
            $table->string('card_number')->nullable();
            $table->string('image_path', 1000)->nullable();
            $table->string('card_url', 1000)->nullable();
            $table->string('image_bucket_path', 1000)->nullable();
            $table->string('card_number_order')->nullable();
            $table->timestamps();
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
        Schema::dropIfExists('card_products');
    }
}
