<?php

namespace App\Events\API\Admin\Card;

use App\Models\CardSeries;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CardSeriesCreatedEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(public CardSeries $cardSeries)
    {
        //
    }
}
