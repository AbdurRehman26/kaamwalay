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

test('an admin cannot attach tag to a nonexistent model', function () {
    $response = postJson(route('v3.admin.attach-tags'), [
        'model' => 'IAmANonExistentModel',
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['model' => 'The model is invalid.']);
});

test('an admin cannot tag model to a non-taggable model', function () {
    $response = postJson(route('v3.admin.attach-tags'), [
        'model' => 'user',
        'model_ids' => [$this->user->id],
        'tags' => ['abandoned'],
    ]);

    $response->assertUnprocessable();
    $response->assertJsonFragment(['error' => 'Model is not taggable. Implement Taggable interface on model.']);
});

test('an admin needs model, model_ids, tags to attach tags', function () {
    $response = postJson(route('v3.admin.attach-tags'));

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors([
        'model' => 'The model field is required.',
        'model_ids' => 'The model ids field is required.',
        'tags' => 'The tags field is required.',
    ]);
});

test('an admin can attach tags to order model', function () {
    $orders = Order::factory()->count(2)->create();

    $response = postJson(route('v3.admin.attach-tags'), [
        'model' => 'order',
        'model_ids' => [$orders->first()->id],
        'tags' => ['abandoned'],
    ]);

    $response->assertStatus(200);
    expect($orders->first()->tagExists('abandoned'))->toBe(true);
})->skip(fn () => DB::getDriverName() !== 'mysql', 'Only runs when using mysql');

test('an admin can detach tags from order model', function () {
    $order = Order::factory()->create();
    $order->attachTag('abandoned');

    $response = postJson(route('v3.admin.attach-tags'), [
        'model' => 'order',
        'model_ids' => [$order->id],
        'tags' => ['abandoned'],
    ]);

    $response->assertStatus(200);
    expect($order->tagExists('abandoned'))->toBe(true);
})->skip(fn () => DB::getDriverName() !== 'mysql', 'Only runs when using mysql');

test('a customer cannot attach tag to a model', function () {
    $this->user = User::factory()
        ->withRole(config('permission.roles.customer'))
        ->create();

    actingAs($this->user);

    $response = postJson(route('v3.admin.attach-tags'));

    $response->assertForbidden();
});

test('a salesman cannot attach tag to a model', function () {
    $this->user = User::factory()
        ->withRole(config('permission.roles.salesman'))
        ->create();

    actingAs($this->user);

    $response = postJson(route('v3.admin.attach-tags'));

    $response->assertForbidden();
});
