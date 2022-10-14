<?php

use App\Jobs\ProcessImage;
use App\Models\User;
use Illuminate\Support\Facades\Bus;
use function Pest\Laravel\getJson;

use function Pest\Laravel\postJson;
use function Pest\Laravel\putJson;
use Symfony\Component\HttpFoundation\Response;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->anotherUser = User::factory()->create();
});

test('a customer can update his profile', function () {
    Http::fake([
        // Faking AGS update user API
        'ags.api/users/me/' => Http::response([]),
    ]);
    Bus::fake(ProcessImage::class);
    $this->actingAs($this->user);

    putJson(route('v2.customer.profile'), [
            'first_name' => 'first',
            'last_name' => 'Last',
            'email_subscription' => true,
            'phone' => '1234567890',
            'username' => 'test24',
            'profile_image' => 'https://via.placeholder.com/150',
    ])->assertSuccessful()->assertStatus(200)->assertJsonStructure([
        'data' => [
            'id',
            'first_name',
            'last_name',
            'phone',
            'username',
            'email',
            'profile_image',
            'customer_number',
        ],
    ]);
    Bus::assertDispatched(ProcessImage::class);
});

test('profile update does not dispatch Process Image job if no profile image', function () {
    Http::fake([
        // Faking AGS update user API
        'ags.api/users/me/' => Http::response([]),
    ]);
    Bus::fake(ProcessImage::class);
    $this->actingAs($this->user);

    putJson('/api/v2/customer/profile', [
        'first_name' => 'first',
    ])->assertSuccessful();
    Bus::assertNotDispatched(ProcessImage::class);
});

test('customer profile update required fields error', function () {
    Http::fake([
        // Faking AGS update user API
        'ags.api/users/me/' => Http::response([]),
    ]);
    $this->actingAs($this->user);

    putJson(route('v2.customer.profile'), [
        'first_name' => '',
        'last_name' => '',
        'phone' => '',
        'username' => '',
        'profile_image' => '',
    ])->assertInvalid([
        'first_name',
        'last_name',
        'username',
    ]);
});

test('a customer`s username can not be duplicate', function () {
    Http::fake([
        // Faking AGS update user API
        'ags.api/users/me/' => Http::response([]),
    ]);
    $this->actingAs($this->user);

    putJson(route('v2.customer.profile'), [
        'username' => $this->anotherUser->username,
    ])->assertUnprocessable();
});

test('a customer can deactivate their account', function () {
    Http::fake([
        // Faking AGS update user API
        'ags.api/users/me/' => Http::response([
            "app_status" => 1,
            "app_message" => 'OK',
        ]),
    ]);

    $this->actingAs($this->user);
    auth()->login($this->user);

    postJson(route('v2.customer.profile.deactivate'))->assertOk()->assertJsonFragment([
        'success' => true,
    ]);

    // Re-login and retrieve a new session
    $this->actingAs($this->user);
    auth()->login($this->user);

    // This time we should get a 401
    getJson(route('v2.auth.me'))->assertUnauthorized();
});


test('a customer can delete their account', function () {
    Http::fake([
        // Faking AGS update user API
        'ags.api/users/me/' => Http::response([
            "app_status" => 1,
            "app_message" => [
                "Removed successfully",
            ],
        ], Response::HTTP_NO_CONTENT),
    ]);

    $this->actingAs($this->user);
    auth()->login($this->user);

    postJson(route('v2.customer.profile.delete'))->assertOk()->assertJsonFragment([
        'success' => true,
    ]);

    // Re-login and retrieve a new session
    $this->actingAs($this->user);
    auth()->login($this->user);

    // This time we should get a 401
    getJson(route('v2.auth.me'))->assertUnauthorized();

    $user = User::withTrashed()->find($this->user->id);
    expect($user)->not()->toBeNull()->and($user->trashed())->toBeTrue()->and($user->first_name)->toBeEmpty();
});

test('a customer cannot delete their account if ags fail', function () {
    Http::fake([
        // Faking AGS update user API
        'ags.api/users/me/' => Http::response([
            "app_status" => 0,
            "app_message" => [
                "Removed successfully",
            ],
        ]),
    ]);

    $this->actingAs($this->user);
    auth()->login($this->user);

    postJson(route('v2.customer.profile.delete'))->assertUnprocessable();

    // Re-login and retrieve a new session
    $this->actingAs($this->user);
    auth()->login($this->user);

    // This time we should get a 401
    getJson(route('v2.auth.me'))->assertOk();
});

test('deactivating profile returns password error if ags token is null', function () {
    $this->user->ags_access_token = null;
    $this->actingAs($this->user);
    postJson(route('v2.customer.profile.deactivate'))->assertStatus(400)->assertJson([
        'error' => 'Please enter your AGS password.',
    ]);
});

test('deleting profile returns password error if ags token is null', function () {
    $this->user->ags_access_token = null;
    $this->actingAs($this->user);
    postJson(route('v2.customer.profile.delete'))->assertStatus(400)->assertJson([
        'error' => 'Please enter your AGS password.',
    ]);
});
