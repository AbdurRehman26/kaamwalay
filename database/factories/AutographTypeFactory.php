<?php

namespace Database\Factories;

use App\Models\AutographType;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class AutographTypeFactory extends Factory
{
    protected $model = AutographType::class;

    public function definition(): array
    {
        return [
            'name' => ucfirst($this->faker->word()),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }
}
