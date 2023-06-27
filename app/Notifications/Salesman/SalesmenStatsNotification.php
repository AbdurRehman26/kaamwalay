<?php

namespace App\Notifications\Salesman;

use Carbon\Carbon;
use Illuminate\Notifications\Messages\SlackMessage;
use Illuminate\Notifications\Notification;

class SalesmenStatsNotification extends Notification
{
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(public array $salesmenStats)
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(mixed $notifiable): array
    {
        return ['slack'];
    }

    public function toSlack(mixed $notifiable): SlackMessage
    {
        return (new SlackMessage)
            ->from('Robograding', ':bar_chart:')
            ->success()
            ->attachment(function ($attachment) {
                $attachment->title('Sales Reps Stats')
                    ->content($this->getContent());
            });
    }

    protected function getContent(): string
    {
        $monthYear = Carbon::parse($this->salesmenStats['date'])->format('F-Y');
        $content = "Month: {$monthYear}\n";

        foreach ($this->salesmenStats['data'] as $salesmenStat) {
            $content .= "\n$salesmenStat[full_name], \$$salesmenStat[total]";
        }

        return $content;
    }
}
