<?php

namespace App\Http\Resources\API\V3\Customer;

use App\Http\Resources\API\BaseResource;
use App\Models\DatabaseNotification;

/**
 * @mixin DatabaseNotification
 */
class PushNotificationResource extends BaseResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->data['title'],
            'body' => $this->data['body'],
            'intent' => $this->data['intent'],
            'created_at' => $this->formatDate($this->created_at),
            'read_at' => $this->formatDate($this->read_at),
        ];
    }
}
