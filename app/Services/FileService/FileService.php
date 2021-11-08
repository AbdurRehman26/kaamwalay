<?php

namespace App\Services\FileService;

use App\Http\Requests\API\Files\UploadRequest;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class FileService
{
    public function preSignFile(UploadFile $file): UploadFile
    {
        $key = $this->generateKey($file);
        $signedUrl = $this->preSignUploadUrl($key, $file->getContentType());
        $url = Storage::disk('s3')->url($key);

        return $file->setUrl($url)->setSignedUrl($signedUrl)->setKey($key);
    }

    public function preSignFileFromRequest(UploadRequest $request): UploadFile
    {
        return $this->preSignFile(UploadFile::fromRequest($request));
    }

    private function getClient()
    {
        return Storage::disk('s3')->getDriver()->getAdapter()->getClient();
    }

    protected function preSignUploadUrl($key, $contentType): string
    {
        $client = $this->getClient();
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
        } catch (\Exception $e) {
            $userId = 'guest';
        }

        $now = Carbon::now();
        $extension = pathinfo($file->getFileName(), PATHINFO_EXTENSION);
        $data = [
            "uid" => $userId,
            "year" => $now->year,
            "mon" => $now->month,
            "day" => $now->day,
            "hour" => $now->hour,
            "min" => $now->minute,
            "sec" => $now->second,
            "ext" => $extension,
        ];

        $hash = sha1($file->getFileName()."_".$file->getSize()."_".$file->getContentType());
        $segments = [
            "users/{uid}/{year}-{mon}-{day}",
            $file->getPrefix(),
            $hash,
            $file->getSuffix(),
        ];

        $segments = array_map('trim', $segments);
        $segments = array_values(array_filter($segments));
        $path = implode('/', $segments);
        $path = $this->buildPath($path, $data);
        $path = explode('/', $path);
        $path = array_map('rawurlencode', $path);
        $path = array_map('trim', $path);
        $segments = array_values(array_filter($path));

        return implode('/', $segments).'.'.$extension;
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
