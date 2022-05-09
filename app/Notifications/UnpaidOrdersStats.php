<?php

namespace App\Notifications;

use Carbon\Carbon;
use Illuminate\Notifications\Messages\SlackMessage;
use Illuminate\Notifications\Notification;

class UnpaidOrdersStats extends Notification
{
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(public array $unpaidDailyStats, public array $unpaidMonthlyStats)
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via(mixed $notifiable)
    {
        return ['slack'];
    }

    public function toSlack(mixed $notifiable): SlackMessage
    {
        $monthYear = Carbon::parse($this->unpaidMonthlyStats['date'])->format('F-Y');

        return (new SlackMessage)
            ->from('Robograding', ':robot_face:')
            ->content("Unpaid Orders Stats\nDate: {$this->unpaidDailyStats['date']}, Unpaid: \${$this->unpaidDailyStats['unpaidTotal']} ({$this->unpaidDailyStats['totalOrders']}) \n Month: {$monthYear}, Unpaid: \${$this->unpaidMonthlyStats['unpaidTotal']} ({$this->unpaidMonthlyStats['totalOrders']})");
    }
}
