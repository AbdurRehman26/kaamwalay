<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class AutographProductFactory extends Factory
{
    public function definition(): array
    {
        return [
            'autograph_category_id' => 1,
            'autograph_type_id' => $this->faker->numberBetween(1, 4),
            'certificate_number' => 'SCAGS'.$this->faker->numberBetween(1000, 9999),
            'name' => Str::headline($this->faker->words(6, true)),
            'image_url' => 'https://ags-cdn.s3.amazonaws.com/images/ags-logo.jpg',
            'signed_by' => $this->faker->name(),
            'signed_at' => Carbon::now(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }
}
