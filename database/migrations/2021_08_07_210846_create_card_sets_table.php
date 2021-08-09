<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCardSetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('card_sets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('card_series_id')->constrained();
            $table->string('name', 200);
            $table->string('description', 1000);
            $table->integer('cards_number')->nullable();
            $table->integer('secret_cards')->nullable();
            $table->string('release_date_formatted', 50)->nullable();
            $table->string('image_path', 1000);
            $table->string('image_bucket_path', 1000);
            $table->string('set_url', 1000)->nullable();
            $table->date('release_date')->nullable();
            $table->integer('release_year')->nullable();
            $table->foreignId('card_category_id')->constrained();
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
        Schema::dropIfExists('card_sets');
    }
}
