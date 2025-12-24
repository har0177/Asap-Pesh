<?php

use App\Http\Controllers\Admin\ApplicationController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\PublicSite\HomeController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Inertia Routes (React + Ant Design)
|--------------------------------------------------------------------------
|
| These routes use the new React/Inertia/Ant Design frontend.
| They are prefixed with /v2 during the transition period.
| Once migration is complete, remove the prefix and update the old routes.
|
*/

// Public Routes (React)
Route::prefix('v2')->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('v2.home');
    Route::get('/about', [HomeController::class, 'about'])->name('v2.about');
    Route::get('/contact', [HomeController::class, 'contact'])->name('v2.contact');
    Route::get('/gallery', [HomeController::class, 'gallery'])->name('v2.gallery');
    Route::get('/staff', [HomeController::class, 'staff'])->name('v2.staff');
    Route::get('/merit-list', [HomeController::class, 'meritList'])->name('v2.merit-list');
    Route::get('/event/{event:slug}', [HomeController::class, 'showEvent'])->name('v2.event.show');
});

// Admin Routes (React)
Route::prefix('v2/admin')->middleware(['auth'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('v2.admin.dashboard');

    // Users
    Route::get('/users', [UserController::class, 'index'])
        ->name('v2.admin.users.index')
        ->middleware('can:manage users');
    Route::get('/users/create', [UserController::class, 'create'])
        ->name('v2.admin.users.create')
        ->middleware('can:add user');
    Route::post('/users', [UserController::class, 'store'])
        ->name('v2.admin.users.store')
        ->middleware('can:add user');
    Route::get('/users/{user}', [UserController::class, 'show'])
        ->name('v2.admin.users.show')
        ->middleware('can:view user');
    Route::get('/users/{user}/edit', [UserController::class, 'edit'])
        ->name('v2.admin.users.edit')
        ->middleware('can:edit user');
    Route::put('/users/{user}', [UserController::class, 'update'])
        ->name('v2.admin.users.update')
        ->middleware('can:edit user');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])
        ->name('v2.admin.users.destroy')
        ->middleware('can:delete user');

    // Students
    Route::get('/students', [StudentController::class, 'index'])
        ->name('v2.admin.students.index')
        ->middleware('can:manage students');
    Route::get('/students/{student}', [StudentController::class, 'show'])
        ->name('v2.admin.students.show')
        ->middleware('can:view student');
    Route::get('/students/{student}/edit', [StudentController::class, 'edit'])
        ->name('v2.admin.students.edit')
        ->middleware('can:edit student');
    Route::put('/students/{student}', [StudentController::class, 'update'])
        ->name('v2.admin.students.update')
        ->middleware('can:edit student');
    Route::delete('/students/{student}', [StudentController::class, 'destroy'])
        ->name('v2.admin.students.destroy')
        ->middleware('can:delete student');

    // Applications
    Route::get('/applications', [ApplicationController::class, 'index'])
        ->name('v2.admin.applications.index')
        ->middleware('can:manage applications');
    Route::get('/applications/{application}', [ApplicationController::class, 'show'])
        ->name('v2.admin.applications.show')
        ->middleware('can:manage applications');
    Route::put('/applications/{application}/status', [ApplicationController::class, 'updateStatus'])
        ->name('v2.admin.applications.updateStatus')
        ->middleware('can:edit application');
    Route::delete('/applications/{application}', [ApplicationController::class, 'destroy'])
        ->name('v2.admin.applications.destroy')
        ->middleware('can:manage applications');
    Route::get('/applications/export', [ApplicationController::class, 'export'])
        ->name('v2.admin.applications.export')
        ->middleware('can:manage applications');

    // Projects
    Route::get('/projects', [ProjectController::class, 'index'])
        ->name('v2.admin.projects.index')
        ->middleware('can:manage projects');
    Route::get('/projects/create', [ProjectController::class, 'create'])
        ->name('v2.admin.projects.create')
        ->middleware('can:add project');
    Route::post('/projects', [ProjectController::class, 'store'])
        ->name('v2.admin.projects.store')
        ->middleware('can:add project');
    Route::get('/projects/{project}', [ProjectController::class, 'show'])
        ->name('v2.admin.projects.show')
        ->middleware('can:view project');
    Route::get('/projects/{project}/edit', [ProjectController::class, 'edit'])
        ->name('v2.admin.projects.edit')
        ->middleware('can:edit project');
    Route::put('/projects/{project}', [ProjectController::class, 'update'])
        ->name('v2.admin.projects.update')
        ->middleware('can:edit project');
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy'])
        ->name('v2.admin.projects.destroy')
        ->middleware('can:delete project');
});
