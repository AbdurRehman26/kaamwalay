<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;
use NotificationChannels\PusherPushNotifications\PusherChannel;
use NotificationChannels\PusherPushNotifications\PusherMessage;

abstract class PushNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected const ALLOWED_PLATFORMS = ['ios', 'android'];

    protected PusherMessage $pusherMessage;

    /**
     * Get the notification's delivery channels.
     *
     * @param  User  $notifiable
     * @return array
     */
    public function via(User $notifiable): array
    {
        if (app()->environment('local')) {
            return [];
        }

        return [PusherChannel::class];
    }

    public function toPushNotification(User $notifiable): PusherMessage
    {
        $this->pusherMessage = PusherMessage::create();
        $this->prepareForPlatforms($notifiable);

        return $this->pusherMessage;
    }

    protected function prepareForPlatforms(User $notifiable): void
    {
        $notifiable->devices()
            ->whereIn('platform', self::ALLOWED_PLATFORMS)
            ->pluck('platform')
            ->each(function (string $platform) {
                $prepareFor = sprintf('prepareFor%s', Str::ucfirst($platform));
                $this->$prepareFor();
            });
    }

    protected function prepareForIos(): void
    {
        $this->pusherMessage
            ->title($this->getTitle())
            ->body($this->getBody())
            ->setOption('apns.data', $this->getIntent());
    }

    protected function prepareForAndroid(): void
    {
        $this->pusherMessage->withAndroid(
            PusherMessage::create()
                ->title($this->getTitle())
                ->body($this->getBody())
                ->setOption('fcm.data', $this->getIntent())
        );
    }

    abstract protected function getTitle(): string;
    abstract protected function getBody(): string;
    abstract protected function getIntent(): array;
}
