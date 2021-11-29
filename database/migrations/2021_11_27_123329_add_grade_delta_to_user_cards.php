<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddGradeDeltaToUserCards extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_cards', function (Blueprint $table) {
            $table->decimal('overall_grade_adjusted')->nullable();
            $table->string('overall_grade_adjusted_nickname')->nullable();
            $table->decimal('grade_delta')->default(0)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_cards', function (Blueprint $table) {
            $table->dropColumn('overall_grade_adjusted');
            $table->dropColumn('overall_grade_adjusted_nickname');
            $table->dropColumn('grade_delta');
        });
    }
}
