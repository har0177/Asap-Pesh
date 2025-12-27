<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Taxonomy extends Model
{
  use HasFactory, SoftDeletes;
  
  protected $fillable = [ 'type', 'name', 'parent_id' ];
  
  public function parent()
  {
    return $this->belongsTo( self::class, 'parent_id' );
  }

  public function children()
  {
    return $this->hasMany( self::class, 'parent_id' );
  }

}
