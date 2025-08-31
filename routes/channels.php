<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\ChatRoom;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('chat-room.{chatRoomId}', function ($user, $chatRoomId) {
    $chatRoom = ChatRoom::find($chatRoomId);
    
    if (!$chatRoom) {
        return false;
    }
    
    // Check if user is a participant in this chat room
    return $chatRoom->participants()->where('user_id', $user->id)->exists();
});

Broadcast::channel('admin-notifications', function ($user) {
    return $user->isAdmin();
});

Broadcast::channel('seller-notifications.{sellerId}', function ($user, $sellerId) {
    return $user->isSeller() && (int) $user->id === (int) $sellerId;
});
