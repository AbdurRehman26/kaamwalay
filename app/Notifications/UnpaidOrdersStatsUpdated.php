<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\SlackMessage;
use Illuminate\Notifications\Notification;
use Carbon\Carbon;

class UnpaidOrdersStatsUpdated extends Notification
{
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(public $unpaidDailyStats, public $unpaidMonthlyStats)
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
        $monthYear = Carbon::parse($this->unpaidMonthlyStats['Date'])->format('F-Y');

        return (new SlackMessage)
            ->from('Robograding', ':robot_face:')
            ->content("Unpaid Stats \n Date: {$this->unpaidDailyStats['Date']}, Unpaid: \${$this->unpaidDailyStats['unpaidTotal']} ({$this->unpaidDailyStats['totalOrders']}) \n Month: {$monthYear}, Unpaid: \${$this->unpaidMonthlyStats['unpaidTotal']} ({$this->unpaidMonthlyStats['totalOrders']})");
    }
}
