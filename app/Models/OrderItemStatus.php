<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItemStatus extends Model
{
    use HasFactory;

    public const PENDING_STATUS = 1;
    public const MISSING_STATUS = 2;
    public const NOT_ACCEPTED_STATUS = 3;
    public const CONFIRMED_STATUS = 4;
    public const GRADED_STATUS = 5;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'description', 'code'];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
    ];
}
