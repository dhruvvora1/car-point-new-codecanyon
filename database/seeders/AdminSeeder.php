<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\ChatRoom;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'name' => 'CarPoint Admin',
            'email' => 'admin@carpoint.com',
            'password' => Hash::make('admin123'),
            'role' => User::ROLE_ADMIN,
            'phone' => '+1234567890',
            'is_approved' => true,
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Create general group chat room for all sellers
        $groupChat = ChatRoom::create([
            'name' => 'General Sellers Chat',
            'type' => ChatRoom::TYPE_GROUP,
            'description' => 'General discussion room for all sellers',
            'created_by' => $admin->id,
            'is_active' => true,
        ]);

        // Add admin to the group chat
        $groupChat->participants()->attach($admin->id);

        $this->command->info('Admin user created successfully!');
        $this->command->info('Email: admin@carpoint.com');
        $this->command->info('Password: admin123');
    }
}
