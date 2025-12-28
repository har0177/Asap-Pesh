<?php

namespace App\Http\Controllers\PublicSite;

use App\Http\Controllers\Controller;
use App\Models\Content;
use App\Models\Employee;
use App\Models\Gallery;
use App\Models\NewsEvents;
use App\Models\Project;
use App\Models\Setting;
use App\Models\Slide;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        // Get active slides (status is ENUM 'Show'/'Hide')
        $slides = Slide::where('status', 'Show')
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
        // Only show valid projects with diploma and quotas configured
        $activeProjects = Project::with('diploma')
            ->where('status', 1)
            ->whereNotNull('diploma_id')  // Must have a diploma
            ->whereNotNull('quota')       // Must have quotas configured
            ->where('quota', '!=', '[]')  // Not empty quota array
            ->where(function ($query) {
                $query->whereNull('deadline')
                    ->orWhere('deadline', '>=', now());
            })
            ->get()
            ->map(function ($project) {
                return [
                    'id' => $project->id,
                    'name' => $project->name ?? $project->diploma?->name ?? 'Admission Project',
                    'diploma' => $project->diploma?->name,
                    'seats' => $project->seats ?? 0,
                    'fee' => $project->fee,
                    'deadline' => $project->deadline,
                ];
            });

        // Get featured staff/employees (status is boolean)
        $featuredStaff = Employee::where('status', 1)
            ->take(4)
            ->get()
            ->map(function ($employee) {
                return [
                    'id' => $employee->id,
                    'name' => $employee->full_name,
                    'designation' => $employee->designation,
                    'department' => $employee->department ?? null,
                    'photo' => $employee->hasMedia('photos')
                        ? $employee->getFirstMediaUrl('photos')
                        : null,
                ];
            });

        // Get gallery images (status is ENUM 'Show'/'Hide')
        $galleries = Gallery::where('status', 'Show')
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
        $galleries = Gallery::where('status', 'Show')
            ->get()
            ->map(function ($gallery) {
                return [
                    'id' => $gallery->id,
                    'title' => $gallery->title,
                    'description' => $gallery->description ?? null,
                    'images' => $gallery->getMedia('gallery')->map(function ($media) {
                        return [
                            'id' => $media->id,
                            'url' => $media->getUrl(),
                            'thumb' => $media->hasGeneratedConversion('thumb')
                                ? $media->getUrl('thumb')
                                : $media->getUrl(),
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
            ->orderBy('id')
            ->get()
            ->map(function ($employee) {
                // Try both 'avatars' and 'photos' collections for compatibility
                $photo = null;
                if ($employee->hasMedia('avatars')) {
                    $photo = $employee->getFirstMediaUrl('avatars');
                } elseif ($employee->hasMedia('photos')) {
                    $photo = $employee->getFirstMediaUrl('photos');
                }

                return [
                    'id' => $employee->id,
                    'name' => $employee->full_name,
                    'designation' => $employee->designation,
                    'department' => $employee->department ?? null,
                    'qualification' => $employee->qualification ?? null,
                    'email' => $employee->email ?? null,
                    'phone' => $employee->contact_number,
                    'photo' => $photo,
                ];
            });

        return Inertia::render('Public/Staff', [
            'employees' => $employees,
        ]);
    }

    public function meritList(): Response
    {
        $projects = Project::with('diploma')
            ->get()
            ->map(function ($project) {
                return [
                    'id' => $project->id,
                    'name' => $project->diploma?->name ?? 'Admission Project',
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

    public function feeStructure(): Response
    {
        $content = Content::where('slug', 'fee-structure')->first();

        // Get images from Content model (Media Library) or fallback to settings
        $images = [];
        if ($content && $content->hasMedia('images')) {
            $images = $content->getMedia('images')->map(fn($media) => $media->getUrl())->toArray();
        }

        // Fallback to settings if no images in Content
        if (empty($images)) {
            $settingImage = Setting::get('fee_structure_image', '/fee-structure.jpg');
            if ($settingImage) {
                $images = [$settingImage];
            }
        }

        return Inertia::render('Public/FeeStructure', [
            'images' => $images,
            'content' => $content ? [
                'title' => $content->title,
                'description' => $content->description,
            ] : null,
        ]);
    }

    public function agricultureScience(): Response
    {
        $content = Content::where('slug', 'agriculture-science')->first();

        // Get images from Content model (Media Library)
        $images = [];
        if ($content && $content->hasMedia('images')) {
            $images = $content->getMedia('images')->map(fn($media) => $media->getUrl())->toArray();
        }

        // Fallback to default paths if no uploaded images
        if (empty($images)) {
            $images = ['/das/1.jpg', '/das/2.jpg', '/das/3.jpg'];
        }

        return Inertia::render('Public/DiplomaDetail', [
            'diploma' => 'agriculture',
            'title' => $content?->title ?? Setting::get('diploma_das_title', 'Diploma in Agriculture Sciences'),
            'description' => $content?->description ?? Setting::get('diploma_das_description', 'The Diploma in Agriculture Sciences (DAS) is a comprehensive 3-year program designed to equip students with practical knowledge and skills in modern agricultural practices, crop management, soil science, and sustainable farming techniques.'),
            'duration' => Setting::get('diploma_das_duration', '3 Years'),
            'eligibility' => Setting::get('diploma_das_eligibility', 'Matric (Science)'),
            'images' => $images,
            'contentId' => $content?->id,
        ]);
    }

    public function veterinaryScience(): Response
    {
        $content = Content::where('slug', 'veterinary-science')->first();

        // Get images from Content model (Media Library)
        $images = [];
        if ($content && $content->hasMedia('images')) {
            $images = $content->getMedia('images')->map(fn($media) => $media->getUrl())->toArray();
        }

        // Fallback to default paths if no uploaded images
        if (empty($images)) {
            $images = ['/dvs/1.jpg', '/dvs/2.jpg', '/dvs/3.jpg'];
        }

        return Inertia::render('Public/DiplomaDetail', [
            'diploma' => 'veterinary',
            'title' => $content?->title ?? Setting::get('diploma_dvs_title', 'Diploma in Veterinary Sciences'),
            'description' => $content?->description ?? Setting::get('diploma_dvs_description', 'The Diploma in Veterinary Sciences (DVS) is a 3-year professional program focused on animal health, livestock management, disease prevention, and veterinary care practices.'),
            'duration' => Setting::get('diploma_dvs_duration', '3 Years'),
            'eligibility' => Setting::get('diploma_dvs_eligibility', 'Matric (Science)'),
            'images' => $images,
            'contentId' => $content?->id,
        ]);
    }
}
