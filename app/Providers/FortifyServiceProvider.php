<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use App\Actions\Fortify\UpdateUserPassword;
use App\Actions\Fortify\UpdateUserProfileInformation;
use App\Models\User;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
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
    Fortify::createUsersUsing( CreateNewUser::class );
    Fortify::updateUserProfileInformationUsing( UpdateUserProfileInformation::class );
    Fortify::updateUserPasswordsUsing( UpdateUserPassword::class );
    Fortify::resetUserPasswordsUsing( ResetUserPassword::class );

    // Use Inertia for auth views
    Fortify::loginView(function () {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => true,
            'status' => session('status'),
        ]);
    });

    Fortify::registerView(function () {
        return Inertia::render('Auth/Register');
    });

    Fortify::requestPasswordResetLinkView(function () {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    });

    Fortify::resetPasswordView(function (Request $request) {
        return Inertia::render('Auth/ResetPassword', [
            'email' => $request->input('email'),
            'token' => $request->route('token'),
        ]);
    });

    Fortify::verifyEmailView(function () {
        return Inertia::render('Auth/VerifyEmail', [
            'status' => session('status'),
        ]);
    });

    Fortify::confirmPasswordView(function () {
        return Inertia::render('Auth/ConfirmPassword');
    });

    Fortify::authenticateUsing( function( Request $request ) {
      $user = User::where( 'email', $request->username )
                  ->orWhere( 'username', $request->username )
                  ->orWhere( 'phone', $request->username )->first();
      if( $user &&
          Hash::check( $request->password, $user->password ) ) {
        return $user;
      }
    } );

    RateLimiter::for( 'login', function( Request $request ) {
      $throttleKey = Str::transliterate( Str::lower( $request->input( Fortify::username() ) ) . '|' . $request->ip() );

      return Limit::perMinute( 5 )->by( $throttleKey );
    } );

    RateLimiter::for( 'two-factor', function( Request $request ) {
      return Limit::perMinute( 5 )->by( $request->session()->get( 'login.id' ) );
    } );
  }
}
