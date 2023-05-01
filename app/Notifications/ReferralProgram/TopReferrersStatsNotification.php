<?php

namespace App\Notifications\ReferralProgram;

use Carbon\Carbon;
use Illuminate\Notifications\Messages\SlackMessage;
use Illuminate\Notifications\Notification;

class TopReferrersStatsNotification extends Notification
{
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(public array $topReferrersStats)
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
                $attachment->title('Partners Revenue Stats')
                    ->content($this->getContent());
            });
    }

    protected function getContent(): string
    {
        $monthYear = Carbon::parse($this->topReferrersStats['date'])->format('F-Y');
        $content = "Month: {$monthYear}\n\n";

        foreach ($this->topReferrersStats['data'] as $topReferrersStat) {
            $content .= "\n$topReferrersStat[full_name], \$$topReferrersStat[total]";
        }

        return $content;
    }
}
