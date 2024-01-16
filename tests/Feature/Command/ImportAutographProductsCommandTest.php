<?php

use App\Console\Commands\ImportAutographProductsCommand;

it('imports autograph products', function () {
    Storage::fake();
    Storage::put('test.csv', '');
    Storage::makeDirectory('test');

    $this->artisan(ImportAutographProductsCommand::class)
        ->expectsQuestion('Products Filename (storage/app/)', 'test.csv')
        ->expectsQuestion('Images Directory (storage/app/)', 'test')
        ->assertExitCode(0);
});
