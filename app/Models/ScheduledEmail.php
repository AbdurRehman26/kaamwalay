<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScheduledEmail extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['send_at', 'payload', 'is_sent', 'rescheduling_required', 'check_class', 'extra_data'];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'send_at' => 'datetime',
        'is_sent' => 'boolean',
        'rescheduling_required' => 'boolean',
    ];

    public function reschedulingIsRequired(): bool
    {
        return $this->rescheduling_required;
    }
}
