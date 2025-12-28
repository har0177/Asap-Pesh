<?php

namespace App\Models;

use App\Enums\TaxonomyTypeEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
  use HasFactory;

  protected $fillable = [
    'name',
    'acronym',
    'diploma_id',
    'quota',
    'status',
    'start_date',
    'end_date',
    'description',
  ];

  protected $casts = [
    'quota' => 'json'
  ];
  
  public function diploma()
  {
    return $this->belongsTo( Taxonomy::class, 'diploma_id', 'id' )->whereType( TaxonomyTypeEnum::DIPLOMA );
  }
  
  public function applications()
  {
    return $this->hasMany( Application::class );
  }
  
  public function getquotaNameAttribute()
  {
    $list = [];
    if (!is_array($this->quota)) {
      return $list;
    }
    foreach( $this->quota as $quota ) {
      $list[] = Taxonomy::where( 'id', (int) $quota )->first()?->name;
    }
    return $list;
  }

  /**
   * Scope to get only active projects
   */
  public function scopeActive($query)
  {
    return $query->where('status', 1);
  }

  /**
   * Scope to get only open projects (active and within date range)
   */
  public function scopeOpen($query)
  {
    return $query->active()
      ->where('start_date', '<=', now())
      ->where('end_date', '>=', now());
  }

  /**
   * Scope to get closed projects
   */
  public function scopeClosed($query)
  {
    return $query->where('end_date', '<', now());
  }
}
