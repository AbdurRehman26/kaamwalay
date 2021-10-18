<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddExtraChargeFieldsInOrderPaymentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('order_payments', function (Blueprint $table) {
            $table->unsignedTinyInteger('type')
                ->default(1)
                ->comment('1 => order payment, 2 => extra charge, 3 => refund')
                ->after('payment_provider_reference_id');
            $table->decimal('amount', 10, 2)
                ->nullable()
                ->after('payment_provider_reference_id');
            $table->text('notes')
                ->nullable()
                ->after('payment_provider_reference_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('order_payments', function (Blueprint $table) {
            $table->dropColumn('type');
            $table->dropColumn('amount');
            $table->dropColumn('notes');
        });
    }
}
