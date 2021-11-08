<?php

use App\Models\User;

use function Pest\Laravel\postJson;

beforeEach(function () {
    $this->user = User::factory()->create();
});

it("should not allow guest users to presign files", function () {
    $response = postJson('/api/files/presign');
    $response->assertUnauthorized();
});

it("should not presign correctly due to the missing details", function () {
    $this->actingAs($this->user);
    $response = postJson('/api/files/presign');
    $response->assertUnprocessable();
    $response->assertJsonPath('message', 'The given data was invalid.');
});

it("should presign correctly", function () {
    $this->actingAs($this->user);
    $response = postJson('/api/files/presign', [
        'file_name' => 'test.jpg',
        'content_type' => 'image/jpeg',
        'size' => 1024,
    ]);

    $response->assertOk();
});
