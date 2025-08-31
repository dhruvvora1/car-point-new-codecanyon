<?php

namespace App\Http\Controllers;

use App\Models\ChatRoom;
use App\Models\Message;
use App\Models\User;
use App\Models\Car;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ChatController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        $chatRooms = ChatRoom::whereHas('participants', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->with(['participants', 'latestMessage.sender'])
        ->latest('updated_at')
        ->get();

        return Inertia::render('Chat/Index', [
            'chatRooms' => $chatRooms,
        ]);
    }

    public function show(ChatRoom $chatRoom)
    {
        $user = auth()->user();
        
        // Check if user is participant
        if (!$chatRoom->participants()->where('user_id', $user->id)->exists()) {
            abort(403, 'You are not a participant in this chat room.');
        }

        $messages = $chatRoom->messages()
            ->with(['sender', 'car'])
            ->latest()
            ->take(50)
            ->get()
            ->reverse()
            ->values();

        // Mark messages as read
        Message::where('chat_room_id', $chatRoom->id)
            ->where('sender_id', '!=', $user->id)
            ->where('is_read', false)
            ->update(['is_read' => true, 'read_at' => now()]);

        $chatRoom->load(['participants']);

        return Inertia::render('Chat/Show', [
            'chatRoom' => $chatRoom,
            'messages' => $messages,
        ]);
    }

    public function sendMessage(Request $request, ChatRoom $chatRoom)
    {
        $user = auth()->user();
        
        // Check if user is participant
        if (!$chatRoom->participants()->where('user_id', $user->id)->exists()) {
            abort(403, 'You are not a participant in this chat room.');
        }

        $validated = $request->validate([
            'message' => 'required_without_all:attachment,car_id|string|max:1000',
            'type' => 'required|in:text,image,car_reference',
            'attachment' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'car_id' => 'nullable|exists:cars,id',
        ]);

        $messageData = [
            'chat_room_id' => $chatRoom->id,
            'sender_id' => $user->id,
            'message' => $validated['message'] ?? '',
            'type' => $validated['type'],
        ];

        // Handle image attachment
        if ($request->hasFile('attachment')) {
            $path = $request->file('attachment')->store('chat-attachments', 'public');
            $messageData['attachment_url'] = Storage::url($path);
        }

        // Handle car reference
        if (isset($validated['car_id'])) {
            $messageData['car_id'] = $validated['car_id'];
            $car = Car::find($validated['car_id']);
            $messageData['message'] = "Shared car: {$car->brand} {$car->model} ({$car->year})";
        }

        $message = Message::create($messageData);
        $message->load(['sender', 'car']);

        // Update chat room timestamp
        $chatRoom->touch();

        // Broadcast the message via Pusher
        broadcast(new \App\Events\MessageSent($message))->toOthers();

        return response()->json([
            'message' => $message,
            'success' => true,
        ]);
    }

    public function createPrivateChat(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $currentUser = auth()->user();
        $otherUser = User::find($validated['user_id']);

        // Check if both users can chat (both should be approved sellers or one should be admin)
        if (!$currentUser->isAdmin() && !$currentUser->isApproved()) {
            abort(403, 'You need to be approved to start chats.');
        }

        $chatRoom = ChatRoom::createOrGetPrivateRoom($currentUser->id, $otherUser->id);

        return redirect()->route('chat.show', $chatRoom);
    }

    public function getGroupChat()
    {
        $user = auth()->user();
        
        $groupChat = ChatRoom::where('type', ChatRoom::TYPE_GROUP)
            ->where('name', 'General Sellers Chat')
            ->first();

        if (!$groupChat) {
            abort(404, 'Group chat not found.');
        }

        // Add user to group chat if not already a participant
        if (!$groupChat->participants()->where('user_id', $user->id)->exists()) {
            $groupChat->participants()->attach($user->id);
        }

        return redirect()->route('chat.show', $groupChat);
    }

    public function getMessageHistory(ChatRoom $chatRoom, Request $request)
    {
        $user = auth()->user();
        
        // Check if user is participant
        if (!$chatRoom->participants()->where('user_id', $user->id)->exists()) {
            abort(403, 'You are not a participant in this chat room.');
        }

        $page = $request->get('page', 1);
        $perPage = 20;
        $offset = ($page - 1) * $perPage;

        $messages = $chatRoom->messages()
            ->with(['sender', 'car'])
            ->latest()
            ->offset($offset)
            ->take($perPage)
            ->get()
            ->reverse()
            ->values();

        return response()->json([
            'messages' => $messages,
            'hasMore' => $chatRoom->messages()->count() > ($offset + $perPage),
        ]);
    }
}
