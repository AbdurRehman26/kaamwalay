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
    Storage::fake('s3');

    $this->actingAs($this->user);
    $response = postJson('/api/files/presign', [
        'file_name' => 'test.jpg',
        'content_type' => 'image/jpeg',
        'size' => 1024,
    ]);

    $response->assertOk();
    $response->assertJsonStructure([
        'data' => [
            'signed_url',
            'public_url',
            'key',
            'size',
        ],
    ]);
});

it('should correctly presign custom path file', function () {
    Storage::fake('s3');

    $this->actingAs($this->user);
    $response = postJson('/api/files/presign', [
        'file_name' => 'test.jpg',
        'content_type' => 'image/jpeg',
        'size' => 1024,
        'directory' => 'custom-dir',
        'prefix' => 'custom-prefix',
        'suffix' => 'custom-suffix',
    ]);

    $response->assertOk();
    $response->assertJsonPath('data.key', 'custom-prefix/custom-dir/custom-suffix.jpg');
});
