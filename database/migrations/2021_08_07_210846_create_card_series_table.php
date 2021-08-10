<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCardSeriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('card_series', function (Blueprint $table) {
            $table->id();
            $table->string('name', 200);
            $table->string('image_path', 1000);
            $table->string('image_bucket_path', 1000);
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
        Schema::dropIfExists('card_series');
    }
}