<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    const TYPE_TEXT = 'text';
    const TYPE_IMAGE = 'image';
    const TYPE_CAR_REFERENCE = 'car_reference';
    const TYPE_SYSTEM = 'system';

    protected $fillable = [
        'chat_room_id',
        'sender_id',
        'message',
        'type',
        'attachment_url',
        'car_id',
        'is_read',
        'read_at',
    ];

    protected function casts(): array
    {
        return [
            'is_read' => 'boolean',
            'read_at' => 'datetime',
        ];
    }

    /**
     * Get the chat room this message belongs to
     */
    public function chatRoom()
    {
        return $this->belongsTo(ChatRoom::class);
    }

    /**
     * Get the sender of this message
     */
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    /**
     * Get the car referenced in this message (if any)
     */
    public function car()
    {
        return $this->belongsTo(Car::class);
    }

    /**
     * Scope for unread messages
     */
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    /**
     * Scope for messages by type
     */
    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Mark message as read
     */
    public function markAsRead()
    {
        $this->update([
            'is_read' => true,
            'read_at' => now(),
        ]);
    }
}
