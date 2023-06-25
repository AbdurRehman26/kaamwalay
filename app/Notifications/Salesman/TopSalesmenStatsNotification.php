<?php

namespace App\Notifications\Salesman;

use Carbon\Carbon;
use Illuminate\Notifications\Messages\SlackMessage;
use Illuminate\Notifications\Notification;

class TopSalesmenStatsNotification extends Notification
{
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(public array $topSalesmenStats)
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
        $monthYear = Carbon::parse($this->topSalesmenStats['date'])->format('F-Y');
        $content = "Month: {$monthYear}\n";

        foreach ($this->topSalesmenStats['data'] as $topSalesmenStat) {
            $content .= "\n$topSalesmenStat[full_name], \$$topSalesmenStat[total]";
        }

        return $content;
    }
}
