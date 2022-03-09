<?php

use App\Models\Order;
use App\Models\User;
use Database\Seeders\RolesSeeder;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\postJson;
use function Pest\Laravel\seed;

beforeEach(function () {
    seed([
        RolesSeeder::class,
    ]);

    $this->user = User::factory()
        ->admin()
        ->withRole(config('permission.roles.admin'))
        ->create();

    actingAs($this->user);
});

test('an admin cannot export data of nonexistent model', function () {
    $response = postJson(route('v2.admin.export-data'), [
        'model' => 'IAmANonExistentModel',
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['model' => 'The model is invalid.']);
});

test('an admin export data needs model name', function () {
    $response = postJson(route('v2.admin.export-data'));

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['model' => 'The model field is required.']);
});

test('an admin can export data of order model', function () {
    Storage::fake('s3');
    Order::factory()->count(2)->create();

    $response = postJson(route('v2.admin.export-data'), [
        'model' => 'order',
    ]);

    $response->assertStatus(200);
    $response->assertJsonStructure(['data' => ['file_url']]);
});

test('an admin can export data of user model', function () {
    Storage::fake('s3');
    Order::factory()->count(2)->create();

    $response = postJson(route('v2.admin.export-data'), [
        'model' => 'user',
    ]);

    $response->assertStatus(200);
    $response->assertJsonStructure(['data' => ['file_url']]);
});

test('a customer cannot export data of a model', function () {
    $this->user = User::factory()
        ->withRole(config('permission.roles.customer'))
        ->create();

    actingAs($this->user);

    $response = postJson(route('v2.admin.export-data'));

    $response->assertForbidden();
});
