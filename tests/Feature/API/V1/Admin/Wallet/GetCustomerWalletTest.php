<?php

use App\Models\User;
use App\Models\Wallet;
use App\Models\WalletTransaction;

use Illuminate\Database\Eloquent\Factories\Sequence;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;

test('admin can get wallet details', function () {
    $this->seed([\Database\Seeders\RolesSeeder::class]);
    $adminUser = User::factory()->withRole(config('permission.roles.admin'))->create();
    $customer = User::factory()->withRole(config('permission.roles.customer'))->create();
    Wallet::factory()->create([
        'user_id' => $customer->id,
        'balance' => 5000,
    ]);

    actingAs($adminUser);
    getJson(route('customer-wallet-show', ['wallet' => $customer->wallet]))
        ->dump()
        ->assertOk();
});
