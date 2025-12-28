<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
class Application extends Model implements HasMedia
{
  use HasFactory, InteractsWithMedia;

  protected $fillable = [
    'user_id',
    'project_id',
    'application_number',
    'quota',
    'status',
    'payment_date',
    'remarks',
  ];

  protected $casts = [
    'quota' => 'json'
  ];
  
  protected $with = [ 'project' ];
  
  public function project()
  {
    return $this->belongsTo( Project::class );
  }
  
  public function user()
  {
    return $this->belongsTo( User::class );
  }
  
  public function getQuotaNameAttribute()
  {
    $quotaIds = is_array($this->quota) ? $this->quota : [];
    if (empty($quotaIds)) {
      return [];
    }
    return Taxonomy::whereIn('id', $quotaIds)->pluck('name')->toArray();
  }
}
