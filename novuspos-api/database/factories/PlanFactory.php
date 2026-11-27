<?php

namespace Database\Factories;

use App\Models\Plan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Plan>
 */
class PlanFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'slug' => fake()->unique()->slug(2),
            'name' => fake()->words(2, true),
            'description' => fake()->sentence(),
            'price' => 4.99,
            'currency' => 'USD',
            'interval' => 'month',
            'features' => ['Feature 1', 'Feature 2'],
            'highlighted' => false,
            'active' => true,
        ];
    }
}
