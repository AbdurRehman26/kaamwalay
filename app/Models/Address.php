<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasFactory;

    protected const DEFAULT_COUNTRY_ID = 1;

    protected $attributes = [
        'country_id' => self::DEFAULT_COUNTRY_ID,
    ];
}
