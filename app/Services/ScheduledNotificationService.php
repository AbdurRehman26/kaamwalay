<?php

namespace App\Services;

use App\Models\ScheduledNotification;
use App\Models\User;
use App\Services\ScheduledNotification\ShouldStillSendCheckInterface;
use DateTime;
use Exception;
use Log;

class ScheduledNotificationService
{
    public function scheduleNotification(
        DateTime $sendAt,
        string $notificationClass,
        string $notifiableType,
        int $notifiableId,
        array $payload,
        ?string $checkClass = null
    ): void {
        ScheduledNotification::create([
            'send_at' => $sendAt,
            'notification_class' => $notificationClass,
            'notifiable_type' => $notifiableType,
            'notifiable_id' => $notifiableId,
            'payload' => serialize($payload),
            'check_class' => $checkClass,
        ]);
    }

    public function processScheduledNotifications(): void
    {
        ScheduledNotification::unsent()->where('send_at', '<=', now())->each(function (
            ScheduledNotification $scheduledNotification
        ) {
            /* @var User $user */
            $user = $scheduledNotification->notifiable;
            $payload = unserialize($scheduledNotification->payload);

            if (! empty($scheduledNotification->check_class)) {
                $checkClass = $this->getCheckClass($scheduledNotification->check_class);

                if (! $checkClass->shouldStillSend($scheduledNotification)) {
                    $scheduledNotification->markAsSent();

                    return;
                }
            }

            try {
                $user?->notify(new $scheduledNotification->notification_class($payload['content']));

                $scheduledNotification->markAsSent();
            } catch (Exception $e) {
                Log::error('Scheduled notification was not sent', [
                    'notification_id' => $scheduledNotification->id,
                    'error' => $e->getMessage(),
                ]);
            }
        });
    }

    protected function getCheckClass(string $className): ShouldStillSendCheckInterface
    {
        $className = 'App\\Services\\ScheduledNotification\\Check\\'.$className;

        return new $className;
    }
}
