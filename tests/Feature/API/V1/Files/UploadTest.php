<?php

use App\Models\User;

use Database\Seeders\RolesSeeder;
use function Pest\Laravel\postJson;

beforeEach(function () {
    $this->seed(RolesSeeder::class);

    $this->user = User::factory()->create();
    $this->admin = User::factory()->withRole(config('permission.roles.admin'))->create();
});

it("should not allow guest users to presign files", function () {
    $response = postJson('/api/v1/files/presign');
    $response->assertUnauthorized();
});

it("should not presign correctly due to the missing details", function () {
    $this->actingAs($this->user);
    $response = postJson('/api/v1/files/presign');
    $response->assertUnprocessable();
    $response->assertJsonValidationErrors([
        'file_name' => 'The file name field is required.',
        'content_type' => 'The content type field is required.',
        'size' => 'The size field is required.',
    ]);
});

it("should presign correctly", function () {
    Storage::fake('s3');

    $this->actingAs($this->user);
    $response = postJson('/api/v1/files/presign', [
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
    $response = postJson('/api/v1/files/presign', [
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

it("should not let normal user to change bucket", function () {
    Storage::fake('s3');

    $this->actingAs($this->user);
    $response = postJson('/api/v1/files/presign', [
        'file_name' => 'test.jpg',
        'content_type' => 'image/jpeg',
        'size' => 1024,
        'bucket' => 'test-bucket',
    ]);

    $response->assertOk();
    expect($response->json('data.signed_url'))->not->toContain('test-bucket');
});


it("should let admin user to change bucket", function () {
    Storage::fake('s3');

    $this->actingAs($this->admin);
    $response = postJson('/api/v1/files/presign', [
        'file_name' => 'test.jpg',
        'content_type' => 'image/jpeg',
        'size' => 1024,
        'bucket' => 'test-bucket',
    ]);

    $response->assertOk();
    expect($response->json('data.signed_url'))->toContain('test-bucket');
});
