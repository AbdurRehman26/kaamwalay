<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\SlackMessage;
use Illuminate\Notifications\Notification;

class OpsStatsNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public array $opsStats)
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['slack'];
    }

    public function toSlack(mixed $notifiable): SlackMessage
    {
        return (new SlackMessage)
            ->from('Robograding', ':bar_chart:')
            ->content($this->getContent());
    }

    protected function getContent(): string
    {
        $content = "Date: {$this->opsStats['date']}\n\n";

        $content .= "Orders Shipped: {$this->opsStats['total_shipped_orders']}\n";
        $content .= "# of cards: {$this->opsStats['total_cards_in_shipped_orders']}\n\n";
        $content .= "Total Graded: {$this->opsStats['total_graded_cards']}\n\n";
        $content .= "Total Reviewed: {$this->opsStats['total_reviewed_cards']}\n";

        $content .= "\n\nTotal By Grader\n";
        foreach ($this->opsStats['total_graded_cards_by_grader'] as $graderRow) {
            $content .= "{$graderRow['full_name']}: {$graderRow['total']}\n";
        }

        $content .= "\n\nTotal By Reviewer\n";
        foreach ($this->opsStats['total_reviewed_cards_by_reviewer'] as $graderRow) {
            $content .= "{$graderRow['full_name']}: {$graderRow['total']}\n";
        }

        return $content;
    }
}
