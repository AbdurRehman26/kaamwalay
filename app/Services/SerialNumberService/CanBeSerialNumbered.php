<?php

namespace App\Services\SerialNumberService;

interface CanBeSerialNumbered
{
    public static function getPrefixSerialNumber(): string;
}
