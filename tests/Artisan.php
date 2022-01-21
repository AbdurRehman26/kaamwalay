<?php

namespace Tests;
use App\Console\Kernel as BaseKernel;

class Artisan extends BaseKernel
{
    // This will override the parent's call() and block it from doing anything.
    public function call($command, array $parameters = [], $outputBuffer = null)
    {
        // -- Do nothing instead, or add some debug logging here --
    }
}