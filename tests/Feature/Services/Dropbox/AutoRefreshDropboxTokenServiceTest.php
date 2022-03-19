<?php

use App\Services\Dropbox\AutoRefreshDropboxTokenService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Spatie\Dropbox\TokenProvider;

beforeEach(function () {
    $this->service = new AutoRefreshDropboxTokenService();
});

it('implements desired interface')->expect(fn() => $this->service)->toBeInstanceOf(TokenProvider::class);

it('generates token', function () {
    $cacheKey = 'ags-dropbox-token';
    Http::fake([
        '*/oauth2/token' => Http::response([
            'access_token' => 'access_token_by_dropbox',
            'token_type' => 'bearer',
            'expires_in' => 14400,
        ]),
    ]);

    expect($this->service->getToken())->toBe('access_token_by_dropbox');
    expect(Cache::has($cacheKey))->toBeTrue();
    expect(Cache::get($cacheKey))->not()->toBe('access_token_by_dropbox');
    $this->travelTo(now()->addHours(3)->addMinutes(45)->addSeconds(5));
    expect(Cache::has($cacheKey))->toBeFalse();
});
