<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('shipping_metrics', function (Blueprint $table) {
            $table->id();

            $table->foreignId('country_id')->constrained();
            $table->decimal('box_default_value', 10, 2)->nullable();
            $table->decimal('slip_default_value', 10, 2)->nullable();

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
        Schema::dropIfExists('shipping_metrics');
    }
};
