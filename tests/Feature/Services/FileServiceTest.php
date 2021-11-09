<?php

use App\Services\FileService\FileService;
use App\Services\FileService\UploadFile;

beforeEach(function () {
    Storage::fake('s3');
    $this->fileService = $this->app->make(FileService::class);
});

it("should instantiate correctly",  function () {
    expect($this->fileService)->toBeInstanceOf(FileService::class);
});

it("should preSign url correctly", function () {
    $file = new UploadFile("test_file_name.txt", "plain/text", 2048, "prefix/path", "suffix/file");
    $result = $this->fileService->presignUploadFile($file);

    expect($result)->toBeInstanceOf(UploadFile::class);
    expect($file->getPublicUrl())->toContain("/prefix/path/");
    expect($file->getPublicUrl())->toContain("/suffix/file.txt");
});
