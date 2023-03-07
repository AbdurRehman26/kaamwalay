<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
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
     */
    public function down(): void
    {
        Schema::dropIfExists('card_series');
    }
};
