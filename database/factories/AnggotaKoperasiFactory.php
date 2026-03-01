<?php

namespace Database\Factories;

use App\Models\AnggotaKoperasi;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AnggotaKoperasi>
 */
class AnggotaKoperasiFactory extends Factory
{
    protected $model = AnggotaKoperasi::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama' => fake()->name(),
            'nik' => fake()->unique()->numerify('################'),
            'bidang' => fake()->jobTitle(),
            'nowa' => fake()->numerify('08##########'),
        ];
    }
}
