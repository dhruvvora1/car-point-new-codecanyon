<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Car;
use App\Models\SellerProfile;
use App\Models\ChatRoom;
use App\Models\Message;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CarPointTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_access_dashboard()
    {
        $admin = User::factory()->create([
            'role' => User::ROLE_ADMIN,
            'is_approved' => true,
            'is_active' => true,
        ]);

        $response = $this->actingAs($admin)->get('/admin/dashboard');

        $response->assertStatus(200);
    }

    public function test_seller_needs_approval_to_access_dashboard()
    {
        $seller = User::factory()->create([
            'role' => User::ROLE_SELLER,
            'is_approved' => false,
            'is_active' => true,
        ]);

        $response = $this->actingAs($seller)->get('/seller/dashboard');

        $response->assertRedirect('/seller/pending-approval');
    }

    public function test_approved_seller_can_create_car_listing()
    {
        $seller = User::factory()->create([
            'role' => User::ROLE_SELLER,
            'is_approved' => true,
            'is_active' => true,
        ]);

        $carData = [
            'brand' => 'Toyota',
            'model' => 'Camry',
            'year' => 2022,
            'mileage' => 15000,
            'fuel_type' => 'petrol',
            'transmission' => 'automatic',
            'price' => 2500000,
            'currency' => 'INR',
            'location' => 'Near City Mall',
            'city' => 'Mumbai',
            'state' => 'Maharashtra',
            'country' => 'India',
            'description' => 'Well maintained car in excellent condition',
            'features' => ['Air Conditioning', 'Power Steering'],
        ];

        $response = $this->actingAs($seller)->post('/seller/cars', $carData);

        $response->assertRedirect();
        $this->assertDatabaseHas('cars', [
            'brand' => 'Toyota',
            'model' => 'Camry',
            'seller_id' => $seller->id,
        ]);
    }

    public function test_admin_can_approve_seller()
    {
        $admin = User::factory()->create([
            'role' => User::ROLE_ADMIN,
            'is_approved' => true,
            'is_active' => true,
        ]);

        $seller = User::factory()->create([
            'role' => User::ROLE_SELLER,
            'is_approved' => false,
            'is_active' => true,
        ]);

        $response = $this->actingAs($admin)->patch("/admin/sellers/{$seller->id}/approve");

        $response->assertRedirect();
        $this->assertTrue($seller->fresh()->is_approved);
    }

    public function test_chat_room_creation()
    {
        $user1 = User::factory()->create(['role' => User::ROLE_ADMIN]);
        $user2 = User::factory()->create(['role' => User::ROLE_SELLER]);

        $chatRoom = ChatRoom::createOrGetPrivateRoom($user1->id, $user2->id);

        $this->assertNotNull($chatRoom);
        $this->assertEquals(ChatRoom::TYPE_PRIVATE, $chatRoom->type);
        $this->assertTrue($chatRoom->participants()->where('user_id', $user1->id)->exists());
        $this->assertTrue($chatRoom->participants()->where('user_id', $user2->id)->exists());
    }

    public function test_message_creation()
    {
        $sender = User::factory()->create(['role' => User::ROLE_SELLER]);
        $receiver = User::factory()->create(['role' => User::ROLE_ADMIN]);
        
        $chatRoom = ChatRoom::createOrGetPrivateRoom($sender->id, $receiver->id);

        $message = Message::create([
            'chat_room_id' => $chatRoom->id,
            'sender_id' => $sender->id,
            'message' => 'Hello, I need help with my car listing',
            'type' => Message::TYPE_TEXT,
        ]);

        $this->assertNotNull($message);
        $this->assertEquals($sender->id, $message->sender_id);
        $this->assertEquals($chatRoom->id, $message->chat_room_id);
    }

    public function test_car_search_and_filtering()
    {
        $seller = User::factory()->create([
            'role' => User::ROLE_SELLER,
            'is_approved' => true,
        ]);

        Car::factory()->create([
            'seller_id' => $seller->id,
            'brand' => 'Toyota',
            'model' => 'Camry',
            'status' => Car::STATUS_AVAILABLE,
        ]);

        Car::factory()->create([
            'seller_id' => $seller->id,
            'brand' => 'Honda',
            'model' => 'Civic',
            'status' => Car::STATUS_SOLD,
        ]);

        // Test available cars filter
        $availableCars = Car::where('status', Car::STATUS_AVAILABLE)->get();
        $this->assertCount(1, $availableCars);
        $this->assertEquals('Toyota', $availableCars->first()->brand);

        // Test brand filter
        $toyotaCars = Car::where('brand', 'Toyota')->get();
        $this->assertCount(1, $toyotaCars);
    }
}
