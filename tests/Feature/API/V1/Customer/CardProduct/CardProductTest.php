<?php

use App\Jobs\ProcessImage;
use App\Models\CardCategory;
use App\Models\User;
use Database\Seeders\RolesSeeder;
use Illuminate\Support\Facades\Bus;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\postJson;
use function Pest\Laravel\seed;

beforeEach(function () {
    seed([RolesSeeder::class]);

    actingAs(User::factory()->withRole(config('permission.roles.customer'))->create());
});

test('customers can create cards manually', function () {
    Bus::fake();

    postJson('/api/v1/customer/cards', [
        'name' => 'Lorem Ipsum',
        'description' => 'Lorem ipsum dolor sit amet.',
        'image_path' => 'http://www.google.com',
        'card_category_id' => CardCategory::factory()->create()->id,
    ])
        ->assertSuccessful()
        ->assertJsonFragment([
            'name' => 'Lorem Ipsum',
            'short_name' => 'Added Manually',
            'long_name' => 'Lorem ipsum dolor sit amet.',
            'image_path' => 'http://www.google.com',
        ]);

    Bus::assertDispatched(ProcessImage::class);
});

test('customers can not create cards manually without specifying card category', function () {
    postJson('/api/v1/customer/cards', [
        'name' => 'Lorem Ipsum',
        'description' => 'Lorem ipsum dolor sit amet.',
        'image_path' => 'http://www.google.com',
    ])->assertUnprocessable();
});
