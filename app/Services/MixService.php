<?php

namespace App\Services;

use Exception;

class MixService
{
    public function hasFile(string $file, ?string $app = null): bool
    {
        try {
            return (bool)$this->getFile($file, $app);
        } catch (Exception $e) {
            return false;
        }
    }


    /**
     * @throws Exception
     */
    public function getFile(string $file, ?string $app = null): string
    {
        $app ??= 'landings';
        return  mix($file, "apps/$app");
    }
}
