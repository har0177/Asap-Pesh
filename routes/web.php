<?php

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

// Storage link utility
Route::get('/linkstorage', function () {
    Artisan::call('storage:link');
    return 'Storage linked successfully';
});
