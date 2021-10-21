<?php

namespace App\Traits;

use Illuminate\Support\Facades\Auth;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

trait ActivityLog
{
    use LogsActivity;

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty()->dontLogIfAttributesChangedOnly(['updated_at']);
    }

    protected function shouldLogEvent(string $eventName): bool
    {
        return Auth::user() && Auth::user()->isAdmin();
    }
}
