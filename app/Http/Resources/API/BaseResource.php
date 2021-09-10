<?php

namespace App\Http\Resources\API;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BaseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return parent::toArray($request);
    }

    /**
     * @param string|null $date
     * @return string|null
     */
    public function formatDate(string $date = null): ?string
    {
        if ($date) {
            return Carbon::parse($date)->toISOString();
        }

        return null;
    }


    /**
     * @param string $relationship
     * @param mixed $value
     * @param mixed $default
     * @return mixed
     * @noinspection PhpMissingReturnTypeInspection
     */
    protected function whenLoaded($relationship, $value = null, $default = null)
    {
        if (is_string($value) && class_exists($value)) {
            $data = parent::whenLoaded($relationship);
            if ($data) {
                return new $value($data);
            }
        }

        return parent::whenLoaded($relationship, $value, $default);
    }
}
