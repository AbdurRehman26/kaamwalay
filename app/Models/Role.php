<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    const ADMIN_ROLE_ID = 1;
    const CUSTOMER_ROLE_ID = 2;

    const ADMIN_NAME = 'Admin';
    const CUSTOMER_NAME = 'Customer';

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = ['pivot'];

    public function users()
    {
        return $this->belongsToMany(User::class)->withTimestamps();
    }
}
