<?php

namespace App\Services;

use Exception;
use Log;
use Spatie\Dropbox\Client;
use Spatie\Dropbox\Exceptions\BadRequest;

class DropboxService
{
    protected Client $client;

    public function __construct()
    {
        $this->client = new Client(config('services.dropbox.token'));
    }

    public function createFolderBatch(array $paths): bool
    {
        $paths = collect($paths)->map(function (string $path) {
            return $this->normalizePath($path);
        })->toArray();

        try {
            $response = $this->client->rpcEndpointRequest('files/create_folder_batch', [
                'paths' => $paths,
            ]);

            if (empty($response['.tag'])) {
                Log::error('Folders could not be created on Dropbox.', [
                    'response' => $response,
                    'folders' => $paths,
                ]);

                return false;
            }

            return true;
        } catch (BadRequest $e) {
            Log::error($e->response->getBody());

            return false;
        } catch (Exception $e) {
            Log::error($e->getMessage());

            return false;
        }
    }

    /**
     * @see Client
     * @param  string  $path
     * @return string
     */
    protected function normalizePath(string $path): string
    {
        if (preg_match("/^id:.*|^rev:.*|^(ns:[0-9]+(\/.*)?)/", $path) === 1) {
            return $path;
        }

        $path = trim($path, '/');

        return ($path === '') ? '' : '/'.$path;
    }
}
