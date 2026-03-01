<?php

namespace Database\Factories;

use App\Models\Bidang;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Bidang>
 */
class BidangFactory extends Factory
{
    protected $model = Bidang::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama_bidang' => fake()->unique()->jobTitle(),
        ];
    }
}
