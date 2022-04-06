<?php

use App\Models\PaymentMethod;
use App\Models\VaultShipment;
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
        Schema::create('vault_shipment_payments', function (Blueprint $table) {
            $table->id();


            $table->foreignId('vault_shipment_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table->foreignId('payment_method_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->text('request')->nullable();
            $table->text('response')->nullable();
            $table->text('payment_provider_reference_id')->nullable();
            $table->decimal('amount', 10, 2);
            $table->decimal('provider_fee', 10, 2)->default(0.0);

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
        Schema::dropIfExists('vault_shipment_payments');
    }
};
