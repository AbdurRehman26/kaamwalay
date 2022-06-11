<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HubspotDeal extends Model
{
    protected $fillable = ['deal_name', 'deal_id', 'user_email', 'owner_id'];
}
