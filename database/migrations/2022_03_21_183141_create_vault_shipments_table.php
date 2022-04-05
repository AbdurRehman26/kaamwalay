<?php

use App\Models\Coupon;
use App\Models\OrderAddress;
use App\Models\ShippingMethod;
use App\Models\User;
use App\Models\VaultShipmentItem;
use App\Models\VaultShipmentStatus;
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
        Schema::create('vault_shipments', function (Blueprint $table) {
            $table->id();

            $table->foreignIdFor(User::class)
                ->constrained()
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->foreignId('shipping_address_id')
                ->references('id')
                ->on('order_addresses')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->foreignId('billing_address_id')
                ->references('id')
                ->on('order_addresses')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->foreignIdFor(VaultShipmentStatus::class)
                ->constrained()
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->foreignIdFor(Coupon::class)
                ->nullable()
                ->constrained()
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->foreignIdFor(ShippingMethod::class)
                ->constrained()
                ->cascadeOnDelete()
                ->cascadeOnUpdate();

            $table->string('shipment_number')->index();
            $table->string('tracking_number')->nullable();
            $table->string('tracking_url')->nullable();
            $table->string('shipping_provider')->nullable();

            $table->decimal('shipping_fee', 10, 2);
            $table->decimal('payment_method_discount', 10, 2)->default(0);
            $table->decimal('amount_paid_from_wallet', 10, 2)->default(0);
            $table->decimal('discounted_amount', 10, 2)->default(0);
            $table->decimal('grand_total', 10, 2);

            $table->timestamp('shipped_at')->nullable();
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
        Schema::dropIfExists('vault_shipments');
    }
};
