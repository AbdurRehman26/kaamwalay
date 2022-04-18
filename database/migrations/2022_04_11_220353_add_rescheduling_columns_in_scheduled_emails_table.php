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
        Schema::table('scheduled_emails', function (Blueprint $table) {
            $table->after('is_sent', function (Blueprint $table) {
                $table->boolean('rescheduling_required')->default(false)->comment('Decides if this scheduled email needs rescheduling');
                $table->string('check_class')->nullable()->comment('Class which decides further sending and rescheduling');
                $table->longText('extra_data')->nullable()->comment('Extra data if needed in check class');
            });
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('scheduled_emails', function (Blueprint $table) {
            $table->dropColumn('rescheduling_required');
            $table->dropColumn('check_class');
            $table->dropColumn('extra_data');
        });
    }
};
