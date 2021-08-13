<?php

namespace App\Http\Resources\API;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class BaseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return parent::toArray($request);
    }

    public function formatDate(string $date = null): ?string
    {
        if ($date) {
            return Carbon::parse($date)->toISOString();
        }

        return null;
    }
}
