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
        Schema::create('commission_structures', function (Blueprint $table) {
            $table->id();

            $table->unsignedInteger('level');
            $table->decimal('fixed_value_per_card')->default(0);
            $table->decimal('percentage_value', 8, 4)->default(0);

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
        Schema::dropIfExists('commission_structures');
    }
};
