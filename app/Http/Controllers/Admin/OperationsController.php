<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Dispute;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OperationsController extends Controller
{
    public function bookings(Request $request)
    {
        $query = Booking::with(['customer', 'car', 'seller']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('booking_id', 'like', "%{$search}%")
                  ->orWhereHas('customer', function ($cq) use ($search) {
                      $cq->where('name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('car', function ($cq) use ($search) {
                      $cq->where('brand', 'like', "%{$search}%")
                        ->orWhere('model', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $bookings = $query->latest()->paginate(15);

        $stats = [
            'total' => Booking::count(),
            'pending' => Booking::where('status', 'pending')->count(),
            'confirmed' => Booking::where('status', 'confirmed')->count(),
            'completed' => Booking::where('status', 'completed')->count(),
        ];

        return Inertia::render('admin/operations/Bookings', [
            'bookings' => $bookings,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status', 'type']),
        ]);
    }

    public function disputes(Request $request)
    {
        $query = Dispute::with(['complainant', 'respondent', 'car']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('dispute_id', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%")
                  ->orWhereHas('complainant', function ($cq) use ($search) {
                      $cq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        $disputes = $query->latest()->paginate(15);

        $stats = [
            'total' => Dispute::count(),
            'open' => Dispute::where('status', 'open')->count(),
            'in_progress' => Dispute::where('status', 'in_progress')->count(),
            'resolved' => Dispute::where('status', 'resolved')->count(),
        ];

        return Inertia::render('admin/operations/Disputes', [
            'disputes' => $disputes,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status', 'priority']),
        ]);
    }

    public function tickets(Request $request)
    {
        $query = Ticket::with(['user', 'assignedTo']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('ticket_id', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        $tickets = $query->latest()->paginate(15);

        $stats = [
            'total' => Ticket::count(),
            'open' => Ticket::where('status', 'open')->count(),
            'in_progress' => Ticket::where('status', 'in_progress')->count(),
            'resolved' => Ticket::where('status', 'resolved')->count(),
        ];

        return Inertia::render('admin/operations/Tickets', [
            'tickets' => $tickets,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status', 'priority', 'category']),
        ]);
    }

    public function updateBookingStatus(Booking $booking, Request $request)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,completed,cancelled',
            'notes' => 'nullable|string|max:500',
        ]);

        $booking->update([
            'status' => $request->status,
            'admin_notes' => $request->notes,
        ]);

        return back()->with('success', 'Booking status updated successfully!');
    }

    public function resolveDispute(Dispute $dispute, Request $request)
    {
        $request->validate([
            'resolution' => 'required|string|max:1000',
            'resolution_type' => 'required|in:refund,replacement,compensation,warning',
        ]);

        $dispute->update([
            'status' => 'resolved',
            'resolution' => $request->resolution,
            'resolution_type' => $request->resolution_type,
            'resolved_at' => now(),
            'resolved_by' => auth()->id(),
        ]);

        return back()->with('success', 'Dispute resolved successfully!');
    }

    public function assignTicket(Ticket $ticket, Request $request)
    {
        $request->validate([
            'assigned_to' => 'required|exists:users,id',
        ]);

        $ticket->update([
            'assigned_to' => $request->assigned_to,
            'status' => 'in_progress',
        ]);

        return back()->with('success', 'Ticket assigned successfully!');
    }
}
