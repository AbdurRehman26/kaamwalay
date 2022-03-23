<?php

namespace App\Services\Dropbox;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Spatie\Dropbox\TokenProvider;

class AutoRefreshDropboxTokenService implements TokenProvider
{
    public function getToken(): string
    {
        return Cache::remember('ags-dropbox-token', now()->addHours(3)->addMinutes(45), function () {
            $response = Http::asForm()->post('https://api.dropboxapi.com/oauth2/token', [
                'grant_type' => 'refresh_token',
                'refresh_token' => config('services.dropbox.refresh_token'),
                'client_id' => config('services.dropbox.app_key'),
                'client_secret' => config('services.dropbox.app_secret'),
            ])->json();

            return $response['access_token'];
        });
    }
}
