<?php

namespace App\Providers;

use App\Models\Content;
use App\Models\Project;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;
class AppServiceProvider extends ServiceProvider
{
		
		/**
			* Register any application services.
			*/
		public function register() : void
		{
				//
		}
		
		/**
			* Bootstrap any application services.
			*/
		public function boot() : void
		{
				// Only share Blade view data when not running in console and database is available
				if (!$this->app->runningInConsole()) {
					try {
						$projects = Project::where('expiry_date', '>', now())->first();
						$contents = Content::select('id', 'title', 'slug')->where('status', 'Active')->get();
						View::share(['projects' => $projects, 'contents' => $contents]);
					} catch (\Exception $e) {
						// Silently fail if database is not available
						View::share(['projects' => null, 'contents' => collect([])]);
					}
				}
		}
		
}
