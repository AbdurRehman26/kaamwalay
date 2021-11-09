<?php

use App\Models\User;
use Database\Seeders\RolesSeeder;
use Database\Seeders\CardCategoriesSeeder;
use Illuminate\Foundation\Testing\WithFaker;

uses(WithFaker::class);

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
        CardCategoriesSeeder::class,
    ]);

    $this->user = User::createAdmin([
        'first_name' => $this->faker->firstName,
        'last_name' => $this->faker->lastName,
        'email' => $this->faker->safeEmail,
        'username' => $this->faker->userName,
        'password' => bcrypt('password'),
    ]);

    $this->actingAs($this->user);
});

test('admins can create cards manually', function () {
    $response = $this->postJson('/api/admin/cards',[
        'name' => 'Lorem Ipsum',
        'description' => 'Lorem ipsum dolor sit amet.',
        'image_path' => 'http://www.google.com',
        'category' => 1,
        'release_date' => '2021-11-06',
        'series' => 'Admin Series',
        'set' => 'Admin Set',
        'card_number' => '001',
        'language' => 'English',
        'rarity' => 'Common',
        'edition' => '1st Edition',
        'surface' => 'Holo',
        'variant' => 'Lorem'
    ]);

    $response->assertSuccessful();
    $response->assertJsonFragment([
        'long_name' => "2021 Pokemon Admin Series Admin Set 001",
        'short_name' => "1st Edition - Holo - Lorem",
        'name' => "Lorem Ipsum",
        'card_category_name' => "Pokemon",
        'card_set_name' => "Admin Set",
        'card_series_name' => "Admin Series",
        'release_date' => "2021-11-06T00:00:00.000000Z",
        'release_year' => "2021",
        'card_number_order' => "001",
        'image_path' => "http://www.google.com",
        'language' => "English",
        'variant' => "Lorem",
        'surface' => "Holo",
        'edition' => "1st Edition",
        'added_by_customer' => false
    ]);
});
