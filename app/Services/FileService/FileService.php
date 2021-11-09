<?php

namespace App\Services\FileService;

use Aws\S3\S3Client;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Storage;

class FileService
{
    public function presignUploadFile(UploadFile $file): UploadFile
    {
        $key = $this->generateKey($file);
        $signedUrl = $this->getSignedUrl($key, $file->getContentType());
        $url = Storage::disk('s3')->url($key);

        return $file->setPublicUrl($url)->setSignedUrl($signedUrl)->setKey($key);
    }

    private function getStorageClient(): S3Client
    {
        return Storage::disk('s3')->getDriver()->getAdapter()->getClient();
    }

    protected function getSignedUrl(string $key, string $contentType): string
    {
        $client = $this->getStorageClient();
        $expiry = "+10 minutes";

        $command = $client->getCommand('PutObject', [
            'Bucket' => config('filesystems.disks.s3.bucket'),
            'Key' => $key,
            'ContentType' => $contentType,
        ]);

        $request = $client->createPresignedRequest($command, $expiry);

        return (string) $request->getUri();
    }

    private function generateKey(UploadFile $file): string
    {
        try {
            $userId = auth()->id();
        } catch (Exception $e) {
            $userId = 'guest';
        }

        $now = Carbon::now();
        $extension = pathinfo($file->getFileName(), PATHINFO_EXTENSION);
        $hash = sha1($file->getFileName()."_".$file->getSize()."_".$file->getContentType());
        $data = [
            "uid" => $userId,
            "year" => $now->year,
            "mon" => $now->month,
            "day" => $now->day,
            "hour" => $now->hour,
            "min" => $now->minute,
            "sec" => $now->second,
            "ext" => $extension,
            "hash" => $hash,
        ];

        $segments = [
            $file->getPrefix('users/{uid}/files'),
            $file->getDirectory('dates/{year}-{mon}-{day}'),
            $file->getSuffix('{hash}'),
        ];

        $segments = array_map('trim', $segments);
        $segments = array_values(array_filter($segments));
        $path = implode('/', $segments);
        $path = $this->buildPath($path, $data);
        $path = explode('/', $path);
        $path = array_map('rawurlencode', $path);
        $path = array_map('trim', $path);
        $segments = array_values(array_filter($path));

        if ($extension) {
            $extension = '.'.$extension;
        }

        return implode('/', $segments).$extension;
    }

    private function buildPath(string $path, array $data): string
    {
        $matches = [];
        preg_match_all('/{([a-zA-Z0-9_]+)}/', $path, $matches);

        foreach ($matches[1] as $match) {
            $value = $data[$match] ?? '';
            if (is_numeric($value) && $value < 10 && $match !== 'uid') {
                $value = '0'.$value;
            }

            $path = str_replace('{'.$match.'}', $value, $path);
        }

        return $path;
    }
}
