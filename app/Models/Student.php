<?php

namespace App\Models;

use App\Enums\ReligionEnum;
use App\Enums\TaxonomyTypeEnum;
use App\Traits\Filterable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;

class Student extends Model
{
  use Notifiable, SoftDeletes, Filterable;

  /**
   * Searchable fields for the filter trait
   */
  public array $searchable = [
      'father_name',
      'roll_no',
      'user.first_name',
      'user.last_name',
      'user.email',
      'user.phone',
      'user.cnic',
      'diploma.name',
  ];

  protected $guarded;
  
  protected $casts = [
    'created_at'     => 'datetime:m-d-Y H:i:s',
    'updated_at'     => 'datetime:m-d-Y H:i:s',
    'religion'       => ReligionEnum::class
  ];
  
  public function user()
  {
    return $this->belongsTo( User::class );
  }
  
  public function diploma() : BelongsTo
  {
    return $this->belongsTo( Taxonomy::class )->whereType( TaxonomyTypeEnum::DIPLOMA );
  }
  public function section() : BelongsTo
  {
    return $this->belongsTo( Taxonomy::class )->whereType( TaxonomyTypeEnum::SECTION );
  }
  
  public function bloodGroup() : BelongsTo
  {
    return $this->belongsTo( Taxonomy::class )->whereType( TaxonomyTypeEnum::BLOODGROUP );
  }
  
  public function gender() : BelongsTo
  {
    return $this->belongsTo( Taxonomy::class )->whereType( TaxonomyTypeEnum::GENDER );
  }
  
  public function district() : BelongsTo
  {
    return $this->belongsTo( Taxonomy::class )->whereType( TaxonomyTypeEnum::DISTRICT );
  }
  
  public function province() : BelongsTo
  {
    return $this->belongsTo( Taxonomy::class )->whereType( TaxonomyTypeEnum::PROVINCE );
  }
  
  public function session() : BelongsTo
  {
    return $this->belongsTo( Taxonomy::class )->whereType( TaxonomyTypeEnum::SESSION );
  }
  
}
