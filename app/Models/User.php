<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    const ROLE_ADMIN = 'admin';
    const ROLE_SELLER = 'seller';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'avatar',
        'is_approved',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_approved' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Check if user is admin
     */
    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    /**
     * Check if user is seller
     */
    public function isSeller(): bool
    {
        return $this->role === self::ROLE_SELLER;
    }

    /**
     * Check if seller is approved
     */
    public function isApproved(): bool
    {
        return $this->is_approved;
    }

    /**
     * Get the seller profile
     */
    public function sellerProfile()
    {
        return $this->hasOne(SellerProfile::class);
    }

    /**
     * Get cars listed by this seller
     */
    public function cars()
    {
        return $this->hasMany(Car::class, 'seller_id');
    }

    /**
     * Get chat rooms where user is a participant
     */
    public function chatRooms()
    {
        return $this->belongsToMany(ChatRoom::class, 'chat_room_participants');
    }

    /**
     * Get messages sent by this user
     */
    public function messages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }
}
