<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MailchimpUser extends Model
{
    use HasFactory;

    protected $fillable = ['list_name', 'list_id'];
}
