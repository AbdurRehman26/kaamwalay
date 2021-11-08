<?php

namespace App\Services\FileService;

use App\Http\Requests\API\Files\UploadRequest;
use Carbon\Carbon;
use Hash;
use Illuminate\Support\Facades\Storage;

class FileService
{
    public function preSignFile(UploadFile $file): UploadFile
    {
        $key = $this->generateKey($file);
        $url = $this->preSignUploadUrl($key, $file->getContentType());

        return $file->setUrl($url)->setKey($key);
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
        $now = Carbon::now();

        try {
            $userId = auth()->id();
        } catch (\Exception $e) {
            $userId = null;
        }

        $data = [
            "uid" => $userId,
			"year" => $now->year,
			"month" => $now->month,
			"day" => $now->day,
			"hour" => $now->hour,
			"second" => $now->second,
        ];

        $extension = pathinfo($file->getFileName(), PATHINFO_EXTENSION);
        $hash = sha1($file->getFileName()."_".$file->getSize()."_".$file->getContentType());
        $segments = [
            $file->getPrefix(),
            $hash,
            $file->getSuffix(),
        ];

        $segments = array_map('trim', $segments);
        $segments = array_values(array_filter($segments));

        return implode('/', $segments).'.'.$extension;
    }
}
