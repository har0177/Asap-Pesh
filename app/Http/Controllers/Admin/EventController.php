<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\Notify;
use App\Helpers\Response;
use App\Http\Controllers\Controller;
use App\Models\NewsEvents;
use App\Traits\HasListing;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class EventController extends Controller
{
    use HasListing;

    /**
     * Display events listing page
     */
    public function index(Request $request): InertiaResponse
    {
        return Inertia::render('Admin/CMS/Events/Listing');
    }

    /**
     * JSON listing for DataGridTable (AG Grid)
     */
    public function listing(Request $request): JsonResponse
    {
        try {
            $query = NewsEvents::query();

            // Search
            if ($search = $request->input('search')) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            }

            // Type filter
            if ($type = $request->input('type')) {
                $query->where('type', $type);
            }

            // Sorting
            $sortField = $request->input('sortField', 'id');
            $sortOrder = $request->input('sortOrder', 'desc');
            $query->orderBy($sortField, $sortOrder);

            // Pagination
            $perPage = $request->input('perPage', 20);
            $page = $request->input('page', 1);

            $total = $query->count();
            $data = $query->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get()
                ->map(fn($e) => [
                    'id' => $e->id,
                    'title' => $e->title,
                    'slug' => $e->slug,
                    'type' => $e->type,
                    'description' => $e->description,
                    'expiry_date' => $e->expiry_date,
                    'status' => $e->status ?? 'Show',
                    'file_url' => $e->getFirstMediaUrl('events'),
                    'created_at' => $e->created_at?->format('Y-m-d H:i:s'),
                    'is_expired' => Carbon::parse($e->expiry_date)->isPast(),
                ]);

            return response()->json([
                'data' => $data,
                'total' => $total,
                'page' => $page,
                'perPage' => $perPage,
                'lastPage' => ceil($total / $perPage),
            ]);
        } catch (\Throwable $e) {
            return Response::error($e->getMessage(), 500);
        }
    }

    /**
     * Store a new event
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:Text,File',
            'description' => 'required_if:type,Text|nullable|string',
            'expiry_date' => 'required|date|after:today',
            'file' => 'required_if:type,File|nullable|file|max:5120',
            'status' => 'nullable|in:Show,Hide',
        ]);

        $event = NewsEvents::create([
            'title' => $validated['title'],
            'type' => $validated['type'],
            'description' => $validated['description'] ?? null,
            'expiry_date' => $validated['expiry_date'],
            'status' => $validated['status'] ?? 'Show',
        ]);

        if ($request->hasFile('file')) {
            $event->clearMediaCollection('events');
            $event->addMediaFromRequest('file')->toMediaCollection('events');
        }

        Notify::success('Event created successfully.');

        if ($request->wantsJson()) {
            return Response::success([
                'event' => $event,
            ]);
        }

        return redirect()->back()->with('success', 'Event created successfully.');
    }

    /**
     * Get a single event
     */
    public function show(Request $request, NewsEvents $event)
    {
        $data = [
            'id' => $event->id,
            'title' => $event->title,
            'slug' => $event->slug,
            'type' => $event->type,
            'description' => $event->description,
            'expiry_date' => $event->expiry_date,
            'status' => $event->status,
            'file_url' => $event->getFirstMediaUrl('events'),
        ];

        if ($request->wantsJson()) {
            return Response::success([
                'event' => $data,
            ]);
        }

        return Inertia::render('Admin/CMS/Events/Show', [
            'event' => $data,
        ]);
    }

    /**
     * Update an event
     */
    public function update(Request $request, NewsEvents $event)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:Text,File',
            'description' => 'required_if:type,Text|nullable|string',
            'expiry_date' => 'required|date',
            'file' => 'nullable|file|max:5120',
            'status' => 'nullable|in:Show,Hide',
        ]);

        $event->update([
            'title' => $validated['title'],
            'type' => $validated['type'],
            'description' => $validated['description'] ?? null,
            'expiry_date' => $validated['expiry_date'],
            'status' => $validated['status'] ?? 'Show',
        ]);

        if ($request->hasFile('file')) {
            $event->clearMediaCollection('events');
            $event->addMediaFromRequest('file')->toMediaCollection('events');
        }

        Notify::success('Event updated successfully.');

        if ($request->wantsJson()) {
            return Response::success([
                'event' => $event,
            ]);
        }

        return redirect()->back()->with('success', 'Event updated successfully.');
    }

    /**
     * Delete an event
     */
    public function destroy(Request $request, NewsEvents $event)
    {
        if ($event->hasMedia('events')) {
            $event->clearMediaCollection('events');
        }

        $event->delete();

        Notify::success('Event deleted successfully.');

        if ($request->wantsJson()) {
            return Response::success();
        }

        return redirect()->back()->with('success', 'Event deleted successfully.');
    }
}
