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
        Schema::create('card_set_abbreviations', function (Blueprint $table) {
            $table->id();
            $table->string('name', 200);
            $table->string('abbreviation', 200);
            $table->string('language', 50)->default('English');
            $table->foreignId('card_category_id')->constrained();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('card_set_abbreviations');
    }
};