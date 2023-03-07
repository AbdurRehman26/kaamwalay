<?php

use App\Models\Order;
use App\Models\User;
use App\Models\Wallet;
use App\Models\WalletPayment;
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
        Schema::create('wallet_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Wallet::class)
                ->constrained()
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table->foreignId('created_by')
                ->constrained('users')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table->foreignIdFor(Order::class)
                ->nullable()
                ->comment('order ID will be available when refund happened or user pay from wallet')
                ->constrained()
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table->foreignIdFor(WalletPayment::class)
                ->nullable()
                ->comment('wallet payment ID will be available when user adds amount to wallet')
                ->constrained()
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table->decimal('amount', 10, 2);
            $table->tinyInteger('type')
                ->comment('1 => credit, 2 => debit');
            $table->tinyInteger('reason')
                ->comment('1 => refund, 2 => order_payment, 3 => wallet_payment');
            $table->boolean('is_success');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wallet_transactions');
    }
};
