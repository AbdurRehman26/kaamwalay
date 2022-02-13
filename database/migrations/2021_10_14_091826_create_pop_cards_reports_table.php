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
        Schema::create('pop_reports_cards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('card_set_id')->constrained();
            $table->foreignId('card_product_id')->unique()->constrained();
            $table->integer('pr')->default(0);
            $table->integer('fr')->default(0);
            $table->integer('good')->default(0);
            $table->integer('good_plus')->default(0);
            $table->integer('vg')->default(0);
            $table->integer('vg_plus')->default(0);
            $table->integer('vg_ex')->default(0);
            $table->integer('vg_ex_plus')->default(0);
            $table->integer('ex')->default(0);
            $table->integer('ex_plus')->default(0);
            $table->integer('ex_mt')->default(0);
            $table->integer('ex_mt_plus')->default(0);
            $table->integer('nm')->default(0);
            $table->integer('nm_plus')->default(0);
            $table->integer('nm_mt')->default(0);
            $table->integer('nm_mt_plus')->default(0);
            $table->integer('mint')->default(0);
            $table->integer('mint_plus')->default(0);
            $table->integer('gem_mt')->default(0);
            $table->integer('total')->default(0);
            $table->integer('total_plus')->default(0);
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
        Schema::dropIfExists('pop_reports_cards');
    }
};
