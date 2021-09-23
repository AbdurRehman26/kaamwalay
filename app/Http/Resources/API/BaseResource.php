<?php

namespace App\Http\Resources\API;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\MissingValue;
use Illuminate\Support\Str;

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

    public function formatDate(string $date = null): ?string
    {
        if ($date) {
            return Carbon::parse($date)->toISOString();
        }

        return null;
    }

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

    protected function whenIncluded($relationship, $resource = null, $internal = null, $default = null)
    {
        $relationship = Str::camel($relationship);
        $internal ??= $relationship;
        $default = value($default ?? new MissingValue());
        $include = request('include', []);
        if (is_string($include)) {
            $include = array_map('trim', explode(',', $include));
        }

        $include = array_map([Str::class, 'camel'], $include);

        if (in_array($relationship, $include, true)) {
            $data = $this->resource->{$internal} ?? $default;
            if ($data && ! ($data instanceof  MissingValue)) {
                if (is_string($resource) && class_exists($resource)) {
                    return new $resource($data);
                }

                return value($resource, $data) ?? $default;
            }
        }

        return $default;
    }
}
