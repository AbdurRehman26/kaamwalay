<?php

namespace App\Services\ReferralProgram;

class ReferralCodeGeneratorService
{
    public static function generate(int $length = 5): string
    {
        $code = '';
        $characters = range('A', 'Z');

        for ($i = 0; $i < $length; $i++) {
            $code .= $characters[rand(0, count($characters) - 1)];
        }

        return $code;
    }
}