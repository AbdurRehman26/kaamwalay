<?php

use App\Console\Commands\ImportAutographProductsCommand;

it('imports autograph products', function () {
    Storage::fake();
    Storage::put('test.csv', '');

    $this->artisan(ImportAutographProductsCommand::class)
        ->expectsQuestion('What do you want to import?', 1)
        ->expectsQuestion('What is file name?', 'test.csv')
        ->assertExitCode(0);
});

it('imports autograph images', function () {
    Storage::fake();
    Storage::makeDirectory('test');

    $this->artisan(ImportAutographProductsCommand::class)
        ->expectsQuestion('What do you want to import?', 2)
        ->expectsQuestion('What is directory name?', 'test')
        ->expectsQuestion('What is files prefix?', 'IMG-')
        ->assertExitCode(0);
});
