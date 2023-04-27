<?php

namespace App\Notifications\ReferralProgram;

use Carbon\Carbon;
use Illuminate\Notifications\Messages\SlackMessage;
use Illuminate\Notifications\Notification;

class TopPartnersStats extends Notification
{
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(public array $topPartnersStats)
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
                $attachment->title('Partners Stats')
                    ->content($this->getContent());
            });
    }

    protected function getContent(): string
    {
        $monthYear = Carbon::parse($this->topPartnersStats['date'])->format('F-Y');
        $content = "Month: {$monthYear}\n\n\nName, Revenue";

        foreach ($this->topPartnersStats['data'] as $partnersStat) {
            $content .= "\n$partnersStat[full_name], \$$partnersStat[total]";
        }

        return $content;
    }
}
