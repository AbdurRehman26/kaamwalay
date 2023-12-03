<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScheduledNotification extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['notification_class', 'notifiable_type', 'notifiable_id', 'send_at', 'payload', 'is_sent', 'check_class'];

    protected $casts = [
        'send_at' => 'datetime',
    ];

    public function notifiable(): \Illuminate\Database\Eloquent\Relations\MorphTo
    {
        return $this->morphTo();
    }

    public function scopeUnsent(Builder $query): Builder
    {
        return $query->where('is_sent', 0);
    }

    public function markAsSent()
    {
        if (! $this->is_sent) {
            $this->forceFill(['is_sent' => true])->save();
        }
    }
}
