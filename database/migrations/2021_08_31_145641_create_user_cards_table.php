<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserCardsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_cards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_item_id')->constrained()->unique();
            $table->foreignId('user_id')->constrained();
            $table->json('human_grade_values')->nullable();
            $table->json('robo_grade_values')->nullable();
            $table->json('overall_values')->nullable();
            $table->decimal('overall_grade', 10, 2)->nullable();
            $table->string('grading_id')->nullable();
            $table->json('ai_model_numbers')->nullable();
            $table->string('front_centering_img_src')->nullable();
            $table->string('front_surface_img_src')->nullable();
            $table->string('front_edges_img_src')->nullable();
            $table->string('front_corners_img_src')->nullable();
            $table->string('back_centering_img_src')->nullable();
            $table->string('back_surface_img_src')->nullable();
            $table->string('back_edges_img_src')->nullable();
            $table->string('back_corners_img_src')->nullable();
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
        Schema::dropIfExists('user_cards');
    }
}
