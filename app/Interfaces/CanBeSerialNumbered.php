<?php

namespace App\Interfaces;

interface CanBeSerialNumbered
{
    public static function getPrefixSerialNumber(): string;
}
