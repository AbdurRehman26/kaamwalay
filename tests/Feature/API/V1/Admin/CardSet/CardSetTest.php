<?php

use App\Models\CardSeries;
use App\Models\CardSet;
use App\Models\User;
use Database\Seeders\RolesSeeder;
use Illuminate\Foundation\Testing\WithFaker;

uses(WithFaker::class);

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
    ]);

    $this->series = CardSeries::factory()->count(2)->create();

    CardSet::factory()->count(2)->create([
        'card_series_id' => 1,
    ]);

    CardSet::factory()->count(3)->create([
        'card_series_id' => 2,
    ]);

    $this->user = User::factory()
        ->admin()
        ->withRole(config('permission.roles.admin'))
        ->create();

    $this->actingAs($this->user);

    $this->sampleGetSeriesResponse = json_decode(file_get_contents(
        base_path() . '/tests/stubs/AGS_get_series_response_200.json'
    ), associative: true);

    $this->sampleGetSetResponse = json_decode(file_get_contents(
        base_path() . '/tests/stubs/AGS_get_set_response_200.json'
    ), associative: true);
});

test('admins can get card set list', function () {
    $response = $this->getJson('/api/v1/admin/cards/sets');

    $response->assertSuccessful();
});

test('admins can filter card set list by series', function () {
    $response = $this->getJson('/api/v1/admin/cards/sets?series_id=' . $this->series[0]->id);

    $response->assertSuccessful();
    $response->assertJsonCount(2, ['data']);
});

test('admins can create sets manually', function () {
    Http::fake([
        '*/series/*' => Http::response($this->sampleGetSeriesResponse, 200, []),
        '*/sets/*' => Http::response($this->sampleGetSetResponse, 200, []),
    ]);

    $response = $this->postJson('/api/v1/admin/cards/sets', [
        'name' => 'Lorem Ipsum',
        'image_path' => 'http://www.google.com',
        'release_date' => '2022-01-01',
        'card_series_id' => 1,
    ]);

    $response->assertSuccessful();
    $response->assertJsonFragment([
        'name' => 'Lorem Ipsum',
        'image_path' => 'http://www.google.com',
        'release_date' => '2022-01-01T00:00:00.000000Z',
    ]);
});

it('fails on repeated set name', function () {
    Http::fake([
        '*/series/*' => Http::response($this->sampleGetSeriesResponse, 200, []),
        '*/sets/*' => Http::response($this->sampleGetSetResponse, 200, []),
    ]);

    $response = $this->postJson('/api/v1/admin/cards/sets', [
        'name' => CardSet::first()->name,
        'image_path' => 'http://www.google.com',
        'release_date' => '2022-01-01',
        'card_series_id' => 1,
    ]);

    $response->assertStatus(422);
    $response->assertJsonFragment([
        'name' => ['The name has already been taken.'],
    ]);
});
