<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class ScheduledNotification extends Model
{
    use HasFactory;

    /**
     * @var array<string>
     */
    protected $fillable = ['notification_class', 'notifiable_type', 'notifiable_id', 'send_at', 'payload', 'is_sent', 'check_class'];

    protected $casts = [
        'send_at' => 'datetime',
    ];

    public function notifiable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * @param  Builder<ScheduledNotification>  $query
     * @return Builder<ScheduledNotification>
     */
    public function scopeUnsent(Builder $query): Builder
    {
        return $query->where('is_sent', 0);
    }

    public function markAsSent(): void
    {
        if (! $this->is_sent) {
            $this->forceFill(['is_sent' => true])->save();
        }
    }
}
