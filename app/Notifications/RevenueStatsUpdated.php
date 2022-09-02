<?php

namespace App\Notifications;

use App\Models\RevenueStatsDaily;
use App\Models\RevenueStatsMonthly;
use Carbon\Carbon;
use Illuminate\Notifications\Messages\SlackMessage;
use Illuminate\Notifications\Notification;

class RevenueStatsUpdated extends Notification
{
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(public RevenueStatsDaily $revenueStatsDaily, public RevenueStatsMonthly $revenueStatsMonthly)
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
        $monthYear = Carbon::parse($this->revenueStatsMonthly->event_at)->format('F-Y');

        return (new SlackMessage)
            ->from('Robograding', ':bar_chart:')
            ->success()
            ->attachment(function ($attachment) use ($monthYear) {
                $attachment->title('Revenue Stats')
                ->content("Date: {$this->revenueStatsDaily->event_at}, Revenue: \${$this->revenueStatsDaily->revenue} , Total Cards: {$this->revenueStatsDaily->total_cards} \n Month: {$monthYear}, Revenue: \${$this->revenueStatsMonthly->revenue}, Total Cards: {$this->revenueStatsMonthly->total_cards}");
            });
    }
}
