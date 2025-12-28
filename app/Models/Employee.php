<?php
		namespace App\Models;
		use App\Enums\TaxonomyTypeEnum;
		use Illuminate\Database\Eloquent\Model;
		use Illuminate\Database\Eloquent\Relations\BelongsTo;
		use Illuminate\Notifications\Notifiable;
		use Spatie\MediaLibrary\HasMedia;
		use Spatie\MediaLibrary\InteractsWithMedia;
		class Employee extends Model implements HasMedia
		{
				use Notifiable;
				use InteractsWithMedia;

				protected $fillable = [
						'name',
						'designation',
						'department',
						'email',
						'phone',
						'gender_id',
						'blood_group_id',
						'address',
						'joining_date',
						'status',
						'order',
				];

				protected $casts = [
						'created_at' => 'datetime:m-d-Y H:i:s',
						'updated_at' => 'datetime:m-d-Y H:i:s'
				];
				public function bloodGroup() : BelongsTo
				{
						return $this->belongsTo( Taxonomy::class )->whereType( TaxonomyTypeEnum::BLOODGROUP );
				}
				public function gender() : BelongsTo
				{
						return $this->belongsTo( Taxonomy::class )->whereType( TaxonomyTypeEnum::GENDER );
				}
				public function getAvatarAttribute()
				{
						return $this->hasMedia( 'avatars' ) ? $this->getFirstMediaUrl( 'avatars' ) : asset( 'profile.png' );
				}

				/**
				 * Get the full name attribute (alias for name for consistency)
				 */
				public function getFullNameAttribute()
				{
						return $this->name;
				}
		}
