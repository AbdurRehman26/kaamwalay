<?php

use App\Models\Order;
use App\Models\User;
use App\Models\Wallet;
use App\Models\WalletTransaction;

use Database\Seeders\RolesSeeder;
use Illuminate\Database\Eloquent\Factories\Sequence;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;

test('admin can get a wallet transaction history', function () {
    $this->seed([RolesSeeder::class]);
    $adminUser = User::factory()->withRole(config('permission.roles.admin'))->create();
    $customer = User::factory()->withRole(config('permission.roles.customer'))->create();
    $wallet = Wallet::factory()->create([
        'user_id' => $customer->id,
        'balance' => 5000,
    ]);

    WalletTransaction::factory()->count(3)->state(new Sequence(
        ['wallet_id' => $wallet->id, 'amount' => 100, 'reason' => WalletTransaction::REASON_ORDER_PAYMENT, 'created_by' => $customer->id, 'order_id' => Order::factory()->create()->id, 'wallet_payment_id' => null],
        ['wallet_id' => $wallet->id, 'amount' => 10, 'reason' => WalletTransaction::REASON_REFUND, 'created_by' => $adminUser->id, 'order_id' => Order::factory()->create()->id, 'wallet_payment_id' => null],
        ['wallet_id' => $wallet->id, 'amount' => 15, 'reason' => WalletTransaction::REASON_WALLET_CREDIT, 'created_by' => $adminUser->id, 'order_id' => Order::factory()->create()->id, 'wallet_payment_id' => null],
    ))->create();

    actingAs($adminUser);
    getJson(route('customer-wallet-history', ['wallet' => $customer->wallet]))
        ->assertOk()
        ->assertJsonCount(3, 'data');
});
