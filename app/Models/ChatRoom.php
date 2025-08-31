<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatRoom extends Model
{
    use HasFactory;

    const TYPE_PRIVATE = 'private';
    const TYPE_GROUP = 'group';

    protected $fillable = [
        'name',
        'type',
        'description',
        'created_by',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the user who created the chat room
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get all participants in this chat room
     */
    public function participants()
    {
        return $this->belongsToMany(User::class, 'chat_room_participants');
    }

    /**
     * Get all messages in this chat room
     */
    public function messages()
    {
        return $this->hasMany(Message::class)->orderBy('created_at', 'asc');
    }

    /**
     * Get the latest message in this chat room
     */
    public function latestMessage()
    {
        return $this->hasOne(Message::class)->latest();
    }

    /**
     * Scope for private chat rooms
     */
    public function scopePrivate($query)
    {
        return $query->where('type', self::TYPE_PRIVATE);
    }

    /**
     * Scope for group chat rooms
     */
    public function scopeGroup($query)
    {
        return $query->where('type', self::TYPE_GROUP);
    }

    /**
     * Scope for active chat rooms
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get chat room for two users (private chat)
     */
    public static function getPrivateRoom($user1Id, $user2Id)
    {
        return self::private()
            ->whereHas('participants', function ($query) use ($user1Id) {
                $query->where('user_id', $user1Id);
            })
            ->whereHas('participants', function ($query) use ($user2Id) {
                $query->where('user_id', $user2Id);
            })
            ->first();
    }

    /**
     * Create or get private chat room between two users
     */
    public static function createOrGetPrivateRoom($user1Id, $user2Id)
    {
        $room = self::getPrivateRoom($user1Id, $user2Id);
        
        if (!$room) {
            $room = self::create([
                'name' => 'Private Chat',
                'type' => self::TYPE_PRIVATE,
                'created_by' => $user1Id,
                'is_active' => true,
            ]);
            
            $room->participants()->attach([$user1Id, $user2Id]);
        }
        
        return $room;
    }
}
