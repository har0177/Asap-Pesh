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

  protected $fillable = [
      'user_id',
      'father_name',
      'dob',
      'roll_no',
      'reg_no',
      'gender_id',
      'blood_group_id',
      'religion',
      'district_id',
      'province_id',
      'address',
      'diploma_id',
      'section_id',
      'session_id',
      'status',
  ];
  
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

  /**
   * Get the educations for the student
   */
  public function educations()
  {
    return $this->hasMany( Education::class, 'user_id', 'user_id' );
  }

  /**
   * Scope to get only active students
   */
  public function scopeActive($query)
  {
    return $query->where('status', 'Active');
  }

  /**
   * Scope to get only admitted students (have reg_no)
   */
  public function scopeAdmitted($query)
  {
    return $query->whereNotNull('reg_no')->where('reg_no', '!=', '');
  }

  /**
   * Scope to get students pending admission
   */
  public function scopePending($query)
  {
    return $query->where('status', 'Pending');
  }

  /**
   * Scope to filter by diploma
   */
  public function scopeOfDiploma($query, $diplomaId)
  {
    return $query->where('diploma_id', $diplomaId);
  }

  /**
   * Scope to filter by session
   */
  public function scopeOfSession($query, $sessionId)
  {
    return $query->where('session_id', $sessionId);
  }
}
