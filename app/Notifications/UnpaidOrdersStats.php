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
            ->from('Robograding', ':bar_chart:')
            ->success()
            ->attachment(function ($attachment) use ($monthYear) {
                $attachment->title('Unpaid Orders Stats')
                    ->content("Date: {$this->unpaidDailyStats['date']}, Unpaid: \${$this->unpaidDailyStats['unpaid_total']} ({$this->unpaidDailyStats['total_orders']})\nMonth: {$monthYear}, Unpaid: \${$this->unpaidMonthlyStats['unpaid_total']} ({$this->unpaidMonthlyStats['total_orders']})");
            });
    }
}