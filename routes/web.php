<?php

use App\Http\Controllers\PrintController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| All routes now use the new React/Inertia/Ant Design frontend.
|
*/

// Include all Inertia routes
require __DIR__.'/inertia.php';

// Print routes (Blade templates for printing)
Route::get('/print-challan/{application}', [PrintController::class, 'challan'])->name('print.challan');
Route::get('/print-form/{application}', [PrintController::class, 'form'])->name('print.form');
Route::get('/student-card', [PrintController::class, 'studentCard'])->name('student.card');
Route::get('/attendance', [PrintController::class, 'attendance'])->name('attendance');

// Storage link utility (protected - admin only)
Route::get('/linkstorage', function () {
    Artisan::call('storage:link');
    return 'Storage linked successfully';
})->middleware(['auth'])->can('manage settings');
