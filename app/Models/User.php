<?php

namespace App\Models;

use App\Traits\HasPermissions;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Jetstream\HasProfilePhoto;
use Laravel\Sanctum\HasApiTokens;
use Plank\Metable\Metable;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class User extends Authenticatable implements HasMedia
{
  use HasApiTokens;
  use HasFactory;
  use HasProfilePhoto;
  use Notifiable;
  use InteractsWithMedia;
  use Metable;
  use TwoFactorAuthenticatable;
  use HasPermissions;
  use SoftDeletes;
  
  /**
   * The attributes that are mass assignable.
   * @var array<int, string>
   */
  protected $fillable = [
    'username',
    'first_name',
    'last_name',
    'email',
    'cnic',
    'phone',
    'password',
    'role_id'
  ];
  
  const ROLE_ADMIN   = 1;
  const ROLE_STUDENT = 2;
  
  /**
   * The attributes that should be hidden for serialization.
   * @var array<int, string>
   */
  protected $hidden = [
    'password',
    'remember_token',
    'two_factor_recovery_codes',
    'two_factor_secret',
  ];
  
  /**
   * The attributes that should be cast.
   * @var array<string, string>
   */
  protected $casts = [
    'email_verified_at' => 'datetime',
  ];
  
  /**
   * The accessors to append to the model's array form.
   * @var array<int, string>
   */
  protected $appends = [
    'avatar',
  ];
  
  public function role()
  {
    return $this->belongsTo( Role::class );
  }
  
  public function getAvatarAttribute() // notice that the attribute name is in CamelCase.
  {
    return $this->hasMedia( 'avatars' ) ? $this->getFirstMediaUrl( 'avatars' ) : asset( 'profile.png' );
  }
  
  public function getRoleNameAttribute() // notice that the attribute name is in CamelCase.
  {
    return $this->role->name;
  }
  
  public function userInfo()
  {
    return $this->hasOne( UserInfo::class );
  }
  
  public function scopeActive( $query )
  {
    return $query->whereNotNull( 'email_verified_at' );
  }
  
  public function getFullNameAttribute()
  {
    return $this->first_name . ' ' . $this->last_name;
  }
}
