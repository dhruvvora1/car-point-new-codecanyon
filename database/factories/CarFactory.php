<?php

namespace Database\Factories;

use App\Models\Car;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Car>
 */
class CarFactory extends Factory
{
    protected $model = Car::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $brands = ['Toyota', 'Honda', 'BMW', 'Mercedes', 'Audi', 'Hyundai', 'Maruti', 'Tata', 'Mahindra', 'Ford'];
        $models = ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible'];
        $fuelTypes = ['petrol', 'diesel', 'electric', 'hybrid', 'cng'];
        $transmissions = ['manual', 'automatic', 'cvt'];
        $statuses = ['available', 'sold', 'pending'];
        $cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Hyderabad'];
        $states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'West Bengal', 'Telangana'];

        $brand = $this->faker->randomElement($brands);
        $model = $this->faker->randomElement($models);
        $year = $this->faker->numberBetween(2010, 2024);
        $city = $this->faker->randomElement($cities);
        $state = $this->faker->randomElement($states);

        return [
            'seller_id' => User::factory()->create(['role' => User::ROLE_SELLER, 'is_approved' => true]),
            'brand' => $brand,
            'model' => $model,
            'year' => $year,
            'mileage' => $this->faker->numberBetween(5000, 150000),
            'fuel_type' => $this->faker->randomElement($fuelTypes),
            'transmission' => $this->faker->randomElement($transmissions),
            'price' => $this->faker->numberBetween(200000, 5000000),
            'currency' => 'INR',
            'location' => $this->faker->streetAddress,
            'city' => $city,
            'state' => $state,
            'country' => 'India',
            'description' => $this->faker->paragraph(3),
            'features' => $this->faker->randomElements([
                'Air Conditioning', 'Power Steering', 'Power Windows', 'ABS', 'Airbags',
                'Alloy Wheels', 'Bluetooth', 'GPS Navigation', 'Backup Camera', 'Sunroof',
                'Leather Seats', 'Heated Seats', 'Cruise Control', 'Keyless Entry'
            ], $this->faker->numberBetween(2, 8)),
            'images' => [
                'https://via.placeholder.com/800x600/0066cc/ffffff?text=' . urlencode($brand . ' ' . $model),
                'https://via.placeholder.com/800x600/cc6600/ffffff?text=' . urlencode('Interior'),
                'https://via.placeholder.com/800x600/00cc66/ffffff?text=' . urlencode('Engine'),
            ],
            'video_url' => $this->faker->optional(0.3)->url,
            'status' => $this->faker->randomElement($statuses),
            'is_featured' => $this->faker->boolean(20), // 20% chance of being featured
            'views_count' => $this->faker->numberBetween(0, 1000),
            'inquiries_count' => $this->faker->numberBetween(0, 50),
        ];
    }

    /**
     * Indicate that the car is available.
     */
    public function available(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => Car::STATUS_AVAILABLE,
        ]);
    }

    /**
     * Indicate that the car is sold.
     */
    public function sold(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => Car::STATUS_SOLD,
        ]);
    }

    /**
     * Indicate that the car is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }

    /**
     * Create a car for a specific seller.
     */
    public function forSeller(User $seller): static
    {
        return $this->state(fn (array $attributes) => [
            'seller_id' => $seller->id,
        ]);
    }
}
