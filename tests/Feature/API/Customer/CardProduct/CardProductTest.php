<?php

use App\Jobs\Images\ImageOptimizer;
use App\Models\User;
use Database\Seeders\RolesSeeder;
use Illuminate\Support\Facades\Queue;

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
    ]);

    $this->user = User::factory()
        ->withRole(config('permission.roles.customer'))
        ->create();

    $this->actingAs($this->user);
});

test('customers can create cards manually', function () {
    Queue::fake();

    $response = $this->postJson('/api/customer/cards', [
        'name' => 'Lorem Ipsum',
        'description' => 'Lorem ipsum dolor sit amet.',
        'image_path' => 'http://www.google.com',
    ]);

    $response->assertSuccessful();
    $response->assertJsonFragment([
        'name' => 'Lorem Ipsum',
        'short_name' => 'Added Manually',
        'long_name' => 'Lorem ipsum dolor sit amet.',
        'image_path' => 'http://www.google.com',
    ]);

    Queue::assertPushed(ImageOptimizer::class);
});
