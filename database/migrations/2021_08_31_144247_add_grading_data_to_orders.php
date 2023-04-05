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
        Schema::table('orders', function (Blueprint $table) {
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('reviewed_by_id')->nullable();
            $table->unsignedBigInteger('graded_by_id')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamp('graded_at')->nullable();

            $table->foreign('reviewed_by_id')->references('id')->on('users');
            $table->foreign('graded_by_id')->references('id')->on('users');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('notes');
            $table->dropColumn('reviewed_at');
            $table->dropColumn('graded_at');

            $table->dropForeign('orders_reviewed_by_id_foreign');
            $table->dropIndex('orders_reviewed_by_id_foreign');
            $table->dropColumn('reviewed_by_id');

            $table->dropForeign('orders_graded_by_id_foreign');
            $table->dropIndex('orders_graded_by_id_foreign');
            $table->dropColumn('graded_by_id');
        });
    }
};
