<?php

use App\Http\Controllers\Admin\ApplicationController;
use App\Http\Controllers\Admin\ContentController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\EmployeeController;
use App\Http\Controllers\Admin\GalleryController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\SlideController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\PublicSite\HomeController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Inertia Routes (React + Ant Design)
|--------------------------------------------------------------------------
|
| Main application routes using React/Inertia/Ant Design frontend.
|
*/

// Public Routes
Route::get('/', [HomeController::class, 'index'])->name('home');

// Auth redirect (for legacy redirects after login)
Route::get('/auth-redirect', function () {
    $user = auth()->user();
    if ($user && $user->role) {
        if ($user->role->name === 'Super Admin' || $user->role->name === 'Admin') {
            return redirect()->route('admin.dashboard');
        }
    }
    return redirect()->route('home');
})->middleware('auth')->name('auth.redirect');
Route::get('/about', [HomeController::class, 'about'])->name('about');
Route::get('/contact', [HomeController::class, 'contact'])->name('contact');
Route::get('/gallery', [HomeController::class, 'gallery'])->name('gallery');
Route::get('/staff', [HomeController::class, 'staff'])->name('staff');
Route::get('/merit-list', [HomeController::class, 'meritList'])->name('merit-list');
Route::get('/event/{event:slug}', [HomeController::class, 'showEvent'])->name('event.show');

// Admin Routes
Route::prefix('admin')->middleware(['auth'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('admin.dashboard');

    // Dropdown options for ProSelect
    Route::post('/dropdown/{type}', [\App\Http\Controllers\Admin\DropdownController::class, '__invoke'])
        ->name('admin.dropdown');

    // Users
    Route::get('/users', [UserController::class, 'index'])
        ->name('admin.users.index')
        ->middleware('can:manage users');
    Route::post('/users/listing', [UserController::class, 'listing'])
        ->name('admin.users.listing')
        ->middleware('can:manage users');
    Route::get('/users/create', [UserController::class, 'create'])
        ->name('admin.users.create')
        ->middleware('can:add user');
    Route::post('/users', [UserController::class, 'store'])
        ->name('admin.users.store')
        ->middleware('can:add user');
    Route::get('/users/{user}', [UserController::class, 'show'])
        ->name('admin.users.show')
        ->middleware('can:view user');
    Route::get('/users/{user}/edit', [UserController::class, 'edit'])
        ->name('admin.users.edit')
        ->middleware('can:edit user');
    Route::put('/users/{user}', [UserController::class, 'update'])
        ->name('admin.users.update')
        ->middleware('can:edit user');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])
        ->name('admin.users.destroy')
        ->middleware('can:delete user');
    Route::post('/users/{user}/restore', [UserController::class, 'restore'])
        ->name('admin.users.restore')
        ->middleware('can:edit user');

    // Students
    Route::get('/students', [StudentController::class, 'index'])
        ->name('admin.students.index')
        ->middleware('can:manage students');
    Route::post('/students/listing', [StudentController::class, 'listing'])
        ->name('admin.students.listing')
        ->middleware('can:manage students');
    Route::get('/students/{student}', [StudentController::class, 'show'])
        ->name('admin.students.show')
        ->middleware('can:view student');
    Route::get('/students/{student}/edit', [StudentController::class, 'edit'])
        ->name('admin.students.edit')
        ->middleware('can:edit student');
    Route::put('/students/{student}', [StudentController::class, 'update'])
        ->name('admin.students.update')
        ->middleware('can:edit student');
    Route::delete('/students/{student}', [StudentController::class, 'destroy'])
        ->name('admin.students.destroy')
        ->middleware('can:delete student');
    Route::post('/students/{student}/restore', [StudentController::class, 'restore'])
        ->name('admin.students.restore')
        ->middleware('can:edit student');

    // Applications
    Route::get('/applications', [ApplicationController::class, 'index'])
        ->name('admin.applications.index')
        ->middleware('can:manage applications');
    Route::post('/applications/listing', [ApplicationController::class, 'listing'])
        ->name('admin.applications.listing')
        ->middleware('can:manage applications');
    Route::get('/applications/{application}', [ApplicationController::class, 'show'])
        ->name('admin.applications.show')
        ->middleware('can:manage applications');
    Route::put('/applications/{application}/status', [ApplicationController::class, 'updateStatus'])
        ->name('admin.applications.updateStatus')
        ->middleware('can:edit application');
    Route::delete('/applications/{application}', [ApplicationController::class, 'destroy'])
        ->name('admin.applications.destroy')
        ->middleware('can:manage applications');
    Route::post('/applications/export', [ApplicationController::class, 'export'])
        ->name('admin.applications.export')
        ->middleware('can:manage applications');
    Route::post('/applications/{application}/restore', [ApplicationController::class, 'restore'])
        ->name('admin.applications.restore')
        ->middleware('can:edit application');

    // Projects
    Route::get('/projects', [ProjectController::class, 'index'])
        ->name('admin.projects.index')
        ->middleware('can:manage projects');
    Route::post('/projects/listing', [ProjectController::class, 'listing'])
        ->name('admin.projects.listing')
        ->middleware('can:manage projects');
    Route::get('/projects/create', [ProjectController::class, 'create'])
        ->name('admin.projects.create')
        ->middleware('can:add project');
    Route::post('/projects', [ProjectController::class, 'store'])
        ->name('admin.projects.store')
        ->middleware('can:add project');
    Route::get('/projects/{project}', [ProjectController::class, 'show'])
        ->name('admin.projects.show')
        ->middleware('can:view project');
    Route::get('/projects/{project}/edit', [ProjectController::class, 'edit'])
        ->name('admin.projects.edit')
        ->middleware('can:edit project');
    Route::put('/projects/{project}', [ProjectController::class, 'update'])
        ->name('admin.projects.update')
        ->middleware('can:edit project');
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy'])
        ->name('admin.projects.destroy')
        ->middleware('can:delete project');
    Route::post('/projects/{project}/restore', [ProjectController::class, 'restore'])
        ->name('admin.projects.restore')
        ->middleware('can:edit project');

    // Roles
    Route::get('/roles', [RoleController::class, 'index'])
        ->name('admin.roles.index')
        ->middleware('can:manage roles');
    Route::post('/roles/listing', [RoleController::class, 'listing'])
        ->name('admin.roles.listing')
        ->middleware('can:manage roles');
    Route::get('/roles/create', [RoleController::class, 'create'])
        ->name('admin.roles.create')
        ->middleware('can:add role');
    Route::post('/roles', [RoleController::class, 'store'])
        ->name('admin.roles.store')
        ->middleware('can:add role');
    Route::get('/roles/{role}', [RoleController::class, 'show'])
        ->name('admin.roles.show')
        ->middleware('can:view role');
    Route::get('/roles/{role}/edit', [RoleController::class, 'edit'])
        ->name('admin.roles.edit')
        ->middleware('can:edit role');
    Route::put('/roles/{role}', [RoleController::class, 'update'])
        ->name('admin.roles.update')
        ->middleware('can:edit role');
    Route::delete('/roles/{role}', [RoleController::class, 'destroy'])
        ->name('admin.roles.destroy')
        ->middleware('can:delete role');

    // Employees
    Route::get('/employees', [EmployeeController::class, 'index'])
        ->name('admin.employees.index')
        ->middleware('can:manage employees');
    Route::post('/employees/listing', [EmployeeController::class, 'listing'])
        ->name('admin.employees.listing')
        ->middleware('can:manage employees');
    Route::get('/employees/create', [EmployeeController::class, 'create'])
        ->name('admin.employees.create')
        ->middleware('can:add employee');
    Route::post('/employees', [EmployeeController::class, 'store'])
        ->name('admin.employees.store')
        ->middleware('can:add employee');
    Route::get('/employees/{employee}', [EmployeeController::class, 'show'])
        ->name('admin.employees.show')
        ->middleware('can:view employee');
    Route::get('/employees/{employee}/edit', [EmployeeController::class, 'edit'])
        ->name('admin.employees.edit')
        ->middleware('can:edit employee');
    Route::put('/employees/{employee}', [EmployeeController::class, 'update'])
        ->name('admin.employees.update')
        ->middleware('can:edit employee');
    Route::delete('/employees/{employee}', [EmployeeController::class, 'destroy'])
        ->name('admin.employees.destroy')
        ->middleware('can:delete employee');

    // CMS - Slides
    Route::get('/slides', [SlideController::class, 'index'])
        ->name('admin.slides.index')
        ->middleware('can:manage cms');
    Route::post('/slides/listing', [SlideController::class, 'listing'])
        ->name('admin.slides.listing')
        ->middleware('can:manage cms');
    Route::post('/slides', [SlideController::class, 'store'])
        ->name('admin.slides.store')
        ->middleware('can:manage cms');
    Route::put('/slides/{slide}', [SlideController::class, 'update'])
        ->name('admin.slides.update')
        ->middleware('can:manage cms');
    Route::delete('/slides/{slide}', [SlideController::class, 'destroy'])
        ->name('admin.slides.destroy')
        ->middleware('can:manage cms');

    // CMS - Gallery
    Route::get('/gallery', [GalleryController::class, 'index'])
        ->name('admin.gallery.index')
        ->middleware('can:manage cms');
    Route::post('/gallery/listing', [GalleryController::class, 'listing'])
        ->name('admin.gallery.listing')
        ->middleware('can:manage cms');
    Route::post('/gallery', [GalleryController::class, 'store'])
        ->name('admin.gallery.store')
        ->middleware('can:manage cms');
    Route::put('/gallery/{gallery}', [GalleryController::class, 'update'])
        ->name('admin.gallery.update')
        ->middleware('can:manage cms');
    Route::delete('/gallery/{gallery}', [GalleryController::class, 'destroy'])
        ->name('admin.gallery.destroy')
        ->middleware('can:manage cms');

    // CMS - Content
    Route::get('/content', [ContentController::class, 'index'])
        ->name('admin.content.index')
        ->middleware('can:manage cms');
    Route::post('/content/listing', [ContentController::class, 'listing'])
        ->name('admin.content.listing')
        ->middleware('can:manage cms');
    Route::get('/content/{content}', [ContentController::class, 'show'])
        ->name('admin.content.show')
        ->middleware('can:manage cms');
    Route::post('/content', [ContentController::class, 'store'])
        ->name('admin.content.store')
        ->middleware('can:manage cms');
    Route::put('/content/{content}', [ContentController::class, 'update'])
        ->name('admin.content.update')
        ->middleware('can:manage cms');
    Route::delete('/content/{content}', [ContentController::class, 'destroy'])
        ->name('admin.content.destroy')
        ->middleware('can:manage cms');
});
