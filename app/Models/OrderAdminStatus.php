<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderAdminStatus extends Model
{
    use HasFactory;

    public const PENDING_STATUS = 1;
    public const REVIEWED_STATUS = 2;
    public const GRADED_STATUS = 3;
    public const SHIPPED_STATUS = 4;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'description'];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
    ];
}
