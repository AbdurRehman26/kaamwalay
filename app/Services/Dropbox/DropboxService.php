<?php

namespace App\Services\Dropbox;

use Exception;
use Spatie\Dropbox\Client;
use Spatie\Dropbox\Exceptions\BadRequest;

class DropboxService
{
    protected Client $client;
    protected string $rootPath;

    public function __construct()
    {
        $this->client = new Client(new AutoRefreshDropboxTokenService());
        $this->rootPath = config('services.dropbox.root_path');
    }

    /**
     * @throws Exception|BadRequest
     */
    public function createFolderBatch(array $paths): array
    {
        $paths = collect($paths)->map(function (string $path) {
            return $this->rootPath . $this->normalizePath($path);
        })->toArray();

        return $this->client->rpcEndpointRequest('files/create_folder_batch', [
            'paths' => $paths,
             // 'force_async' => true, //Enable this if async flow needs to be tested locally
        ]);
    }

    /**
     * @throws Exception|BadRequest
     */
    public function checkFolderBatchStatus(string $asyncJobId): array
    {
        return $this->client->rpcEndpointRequest('files/create_folder_batch/check', [
            'async_job_id' => $asyncJobId,
        ]);
    }

    /**
     * @see Client
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
