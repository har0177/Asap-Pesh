<?php

namespace App\Http\Controllers\PublicSite;

use App\Http\Controllers\Controller;
use App\Models\Content;
use App\Models\Employee;
use App\Models\Gallery;
use App\Models\NewsEvents;
use App\Models\Project;
use App\Models\Slide;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        // Get active slides
        $slides = Slide::where('status', 1)
            ->orderBy('id', 'desc')
            ->get()
            ->map(function ($slide) {
                return [
                    'id' => $slide->id,
                    'title' => $slide->title ?? 'Welcome to ASA Peshawar',
                    'subtitle' => $slide->subtitle ?? 'Excellence in Agricultural and Veterinary Education',
                    'image_path' => $slide->hasMedia('slides')
                        ? $slide->getFirstMediaUrl('slides')
                        : '/images/default-slide.jpg',
                    'link_url' => $slide->url,
                ];
            });

        // Get latest news/events
        $events = NewsEvents::latest()
            ->take(6)
            ->get()
            ->map(function ($event) {
                return [
                    'id' => $event->id,
                    'title' => $event->title,
                    'slug' => $event->slug,
                    'excerpt' => \Str::limit(strip_tags($event->description ?? ''), 150),
                    'type' => $event->type ?? 'news',
                    'featured_image' => $event->hasMedia('featured')
                        ? $event->getFirstMediaUrl('featured')
                        : null,
                    'event_date' => $event->event_date,
                    'created_at' => $event->created_at?->format('M d, Y'),
                ];
            });

        // Get active projects for admissions
        $activeProjects = Project::where('status', 1)
            ->with('diploma')
            ->get()
            ->map(function ($project) {
                return [
                    'id' => $project->id,
                    'name' => $project->name,
                    'diploma' => $project->diploma?->name,
                    'seats' => $project->seats,
                    'fee' => $project->fee,
                    'deadline' => $project->deadline,
                ];
            });

        // Get featured staff/employees
        $featuredStaff = Employee::where('status', 1)
            ->take(4)
            ->get()
            ->map(function ($employee) {
                return [
                    'id' => $employee->id,
                    'name' => $employee->name,
                    'designation' => $employee->designation,
                    'department' => $employee->department,
                    'photo' => $employee->hasMedia('photos')
                        ? $employee->getFirstMediaUrl('photos')
                        : null,
                ];
            });

        // Get gallery images
        $galleries = Gallery::where('status', 1)
            ->take(8)
            ->get()
            ->map(function ($gallery) {
                return [
                    'id' => $gallery->id,
                    'title' => $gallery->title,
                    'image' => $gallery->hasMedia('gallery')
                        ? $gallery->getFirstMediaUrl('gallery')
                        : null,
                ];
            });

        return Inertia::render('Public/Welcome', [
            'slides' => $slides,
            'events' => $events,
            'activeProjects' => $activeProjects,
            'featuredStaff' => $featuredStaff,
            'galleries' => $galleries,
        ]);
    }

    public function about(): Response
    {
        $content = Content::where('slug', 'about')->first();

        return Inertia::render('Public/About', [
            'content' => $content ? [
                'title' => $content->title,
                'body' => $content->body,
            ] : null,
        ]);
    }

    public function contact(): Response
    {
        return Inertia::render('Public/Contact');
    }

    public function gallery(): Response
    {
        $galleries = Gallery::where('status', 1)
            ->get()
            ->map(function ($gallery) {
                return [
                    'id' => $gallery->id,
                    'title' => $gallery->title,
                    'description' => $gallery->description,
                    'images' => $gallery->getMedia('gallery')->map(function ($media) {
                        return [
                            'id' => $media->id,
                            'url' => $media->getUrl(),
                            'thumb' => $media->getUrl('thumb'),
                        ];
                    }),
                ];
            });

        return Inertia::render('Public/Gallery', [
            'galleries' => $galleries,
        ]);
    }

    public function staff(): Response
    {
        $employees = Employee::where('status', 1)
            ->orderBy('order')
            ->get()
            ->map(function ($employee) {
                return [
                    'id' => $employee->id,
                    'name' => $employee->name,
                    'designation' => $employee->designation,
                    'department' => $employee->department,
                    'qualification' => $employee->qualification,
                    'email' => $employee->email,
                    'phone' => $employee->phone,
                    'photo' => $employee->hasMedia('photos')
                        ? $employee->getFirstMediaUrl('photos')
                        : null,
                ];
            });

        return Inertia::render('Public/Staff', [
            'employees' => $employees,
        ]);
    }

    public function meritList(): Response
    {
        $projects = Project::where('status', 1)
            ->with('diploma')
            ->get()
            ->map(function ($project) {
                return [
                    'id' => $project->id,
                    'name' => $project->name,
                    'diploma' => $project->diploma?->name,
                ];
            });

        return Inertia::render('Public/MeritList', [
            'projects' => $projects,
        ]);
    }

    public function showEvent(NewsEvents $event): Response
    {
        return Inertia::render('Public/EventDetail', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'slug' => $event->slug,
                'description' => $event->description,
                'type' => $event->type,
                'event_date' => $event->event_date,
                'featured_image' => $event->hasMedia('featured')
                    ? $event->getFirstMediaUrl('featured')
                    : null,
                'created_at' => $event->created_at?->format('M d, Y'),
            ],
        ]);
    }
}
