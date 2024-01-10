<?php

namespace Database\Factories;

use App\Models\AutographProduct;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class AutographProductFactory extends Factory
{
    protected $model = AutographProduct::class;

    public function definition(): array
    {
        return [
            'autograph_category_id' => $this->faker->numberBetween(1, 2),
            'autograph_type_id' => $this->faker->numberBetween(1, 2),
            'certificate_number' => 'SCAGS'.$this->faker->numberBetween(1000, 9999),
            'name' => Str::headline($this->faker->words(6, true)),
            'image_url' => 'https://den-cards.pokellector.com/305/Bellsprout.SWSH05.1.37528.png',
            'signed_by' => $this->faker->name(),
            'signed_at' => Carbon::now(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }
}
