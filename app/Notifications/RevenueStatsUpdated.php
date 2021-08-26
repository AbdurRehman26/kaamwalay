<?php

namespace App\Notifications;

use App\Models\RevenueStatsDaily;
use Illuminate\Notifications\Messages\SlackMessage;
use Illuminate\Notifications\Notification;

class RevenueStatsUpdated extends Notification
{
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(public RevenueStatsDaily $revenueStatsDaily)
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['slack'];
    }

    public function toSlack($notifiable)
    {
        return (new SlackMessage)
            ->from('Robograding', ':robot_face:')
            ->content("Revenue Stats .\n Date: {$this->revenueStatsDaily->event_at}, Revenue: \${$this->revenueStatsDaily->revenue}, Profit: \${$this->revenueStatsDaily->profit}");
    }
}
