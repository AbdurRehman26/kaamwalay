<?php

use App\Jobs\ProcessImage;
use App\Models\User;
use Database\Seeders\RolesSeeder;
use Illuminate\Support\Facades\Bus;

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
    Bus::fake();

    $response = $this->postJson('/api/v1/customer/cards', [
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

    Bus::assertDispatched(ProcessImage::class);
});
