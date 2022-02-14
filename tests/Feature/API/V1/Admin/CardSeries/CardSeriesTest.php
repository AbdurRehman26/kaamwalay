<?php

use App\Models\CardCategory;
use App\Models\CardSeries;
use App\Models\User;
use Database\Seeders\RolesSeeder;
use Illuminate\Foundation\Testing\WithFaker;

uses(WithFaker::class);

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
    ]);

    $this->categories = CardCategory::factory()->count(2)->create();

    CardSeries::factory()->count(2)->create([
        'card_category_id' => 1,
    ]);

    CardSeries::factory()->count(3)->create([
        'card_category_id' => 2,
    ]);

    $this->user = User::factory()
        ->admin()
        ->withRole(config('permission.roles.admin'))
        ->create();

    $this->actingAs($this->user);

    $this->sampleGetSeriesResponse = json_decode(file_get_contents(
        base_path() . '/tests/stubs/AGS_get_series_response_200.json'
    ), associative: true);
});

test('admins can get card series list', function () {
    $response = $this->getJson('/api/v1/admin/cards/series');

    $response->assertSuccessful();
});

test('admins can filter card series list by category', function () {
    $response = $this->getJson('/api/v1/admin/cards/series?category_id=' . $this->categories[0]->id);

    $response->assertSuccessful();
    $response->assertJsonCount(2, ['data']);
});

test('admins can create series manually', function () {
    Http::fake([
        '*/series/*' => Http::response($this->sampleGetSeriesResponse, 200, []),
    ]);

    $response = $this->postJson('/api/v1/admin/cards/series', [
        'name' => 'Lorem Ipsum',
        'image_path' => 'http://www.google.com',
        'card_category_id' => 1,
    ]);

    $response->assertSuccessful();
    $response->assertJsonFragment([
        'name' => "Lorem Ipsum",
        'image_path' => "http://www.google.com",
    ]);
});

it('fails on repeated series name', function () {
    Http::fake([
        '*/series/*' => Http::response($this->sampleGetSeriesResponse, 200, []),
    ]);

    $response = $this->postJson('/api/v1/admin/cards/series', [
        'name' => CardSeries::first()->name,
        'image_path' => "http://www.google.com",
        'card_category_id' => 1,
    ]);

    $response->assertStatus(422);
    $response->assertJsonFragment([
        'name' => ['The name has already been taken.'],
    ]);
});
