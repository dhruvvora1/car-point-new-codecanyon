<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\ChatRoom;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MessagesController extends Controller
{
    public function inbox(Request $request)
    {
        $query = ChatRoom::whereHas('participants', function ($q) {
            $q->where('user_id', auth()->id());
        })->with(['participants', 'latestMessage.sender']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhereHas('participants', function ($pq) use ($search) {
                      $pq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $chatRooms = $query->latest('updated_at')->paginate(15);

        // Get unread message counts
        foreach ($chatRooms as $room) {
            $room->unread_count = Message::where('chat_room_id', $room->id)
                ->where('sender_id', '!=', auth()->id())
                ->whereNull('read_at')
                ->count();
        }

        $stats = [
            'total_conversations' => ChatRoom::whereHas('participants', function ($q) {
                $q->where('user_id', auth()->id());
            })->count(),
            'unread_messages' => Message::whereHas('chatRoom.participants', function ($q) {
                $q->where('user_id', auth()->id());
            })->where('sender_id', '!=', auth()->id())
              ->whereNull('read_at')
              ->count(),
        ];

        return Inertia::render('seller/messages/Inbox', [
            'chatRooms' => $chatRooms,
            'stats' => $stats,
            'filters' => $request->only(['search', 'type']),
        ]);
    }

    public function show(ChatRoom $chatRoom)
    {
        // Ensure user is participant
        if (!$chatRoom->participants()->where('user_id', auth()->id())->exists()) {
            abort(403);
        }

        $messages = $chatRoom->messages()
            ->with(['sender'])
            ->latest()
            ->paginate(50);

        // Mark messages as read
        Message::where('chat_room_id', $chatRoom->id)
            ->where('sender_id', '!=', auth()->id())
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return Inertia::render('seller/messages/ChatRoom', [
            'chatRoom' => $chatRoom->load('participants'),
            'messages' => $messages,
        ]);
    }

    public function sendMessage(Request $request, ChatRoom $chatRoom)
    {
        // Ensure user is participant
        if (!$chatRoom->participants()->where('user_id', auth()->id())->exists()) {
            abort(403);
        }

        $validated = $request->validate([
            'message' => 'required_without:attachment|string|max:1000',
            'type' => 'required|in:text,image,car_reference',
            'car_id' => 'nullable|exists:cars,id',
            'attachment' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $messageData = [
            'chat_room_id' => $chatRoom->id,
            'sender_id' => auth()->id(),
            'message' => $validated['message'] ?? '',
            'type' => $validated['type'],
            'car_id' => $validated['car_id'] ?? null,
        ];

        // Handle image upload
        if ($request->hasFile('attachment')) {
            $path = $request->file('attachment')->store('chat-attachments', 'public');
            $messageData['attachment_url'] = $path;
        }

        $message = Message::create($messageData);

        // Update chat room timestamp
        $chatRoom->touch();

        // Broadcast the message (will use log driver in development)
        broadcast(new \App\Events\MessageSent($message))->toOthers();

        return back();
    }

    public function createPrivateChat(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $otherUser = User::findOrFail($validated['user_id']);
        
        // Check if private chat already exists
        $existingRoom = ChatRoom::where('type', ChatRoom::TYPE_PRIVATE)
            ->whereHas('participants', function ($q) {
                $q->where('user_id', auth()->id());
            })
            ->whereHas('participants', function ($q) use ($otherUser) {
                $q->where('user_id', $otherUser->id);
            })
            ->first();

        if ($existingRoom) {
            return redirect()->route('seller.messages.show', $existingRoom);
        }

        // Create new private chat
        $chatRoom = ChatRoom::create([
            'name' => auth()->user()->name . ' & ' . $otherUser->name,
            'type' => ChatRoom::TYPE_PRIVATE,
        ]);

        $chatRoom->participants()->attach([auth()->id(), $otherUser->id]);

        return redirect()->route('seller.messages.show', $chatRoom);
    }
}
