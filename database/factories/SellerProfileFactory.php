<?php

namespace Database\Factories;

use App\Models\SellerProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SellerProfile>
 */
class SellerProfileFactory extends Factory
{
    protected $model = SellerProfile::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $businessTypes = ['individual', 'dealer', 'showroom'];
        $cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Hyderabad'];
        $states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'West Bengal', 'Telangana'];

        return [
            'user_id' => User::factory()->create(['role' => User::ROLE_SELLER]),
            'business_name' => $this->faker->optional(0.7)->company,
            'business_type' => $this->faker->randomElement($businessTypes),
            'business_address' => $this->faker->address,
            'city' => $this->faker->randomElement($cities),
            'state' => $this->faker->randomElement($states),
            'postal_code' => $this->faker->postcode,
            'country' => 'India',
            'business_phone' => $this->faker->phoneNumber,
            'business_email' => $this->faker->optional(0.5)->safeEmail,
            'website' => $this->faker->optional(0.3)->url,
            'description' => $this->faker->optional(0.8)->paragraph,
            'license_number' => $this->faker->optional(0.6)->regexify('[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}'),
            'registration_document' => $this->faker->optional(0.4)->imageUrl(640, 480, 'business'),
            'profile_image' => $this->faker->optional(0.6)->imageUrl(400, 400, 'people'),
            'is_verified' => $this->faker->boolean(30), // 30% chance of being verified
        ];
    }

    /**
     * Indicate that the seller profile is verified.
     */
    public function verified(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_verified' => true,
        ]);
    }

    /**
     * Indicate that the seller is a dealer.
     */
    public function dealer(): static
    {
        return $this->state(fn (array $attributes) => [
            'business_type' => 'dealer',
            'business_name' => $this->faker->company . ' Motors',
            'license_number' => $this->faker->regexify('[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}'),
        ]);
    }

    /**
     * Indicate that the seller is a showroom.
     */
    public function showroom(): static
    {
        return $this->state(fn (array $attributes) => [
            'business_type' => 'showroom',
            'business_name' => $this->faker->company . ' Showroom',
            'website' => $this->faker->url,
            'license_number' => $this->faker->regexify('[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}'),
        ]);
    }

    /**
     * Create a profile for a specific user.
     */
    public function forUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
        ]);
    }
}
