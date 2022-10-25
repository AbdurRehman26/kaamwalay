<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Salesman extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'commission_type_id',
        'commission_type_value',
    ];
}
