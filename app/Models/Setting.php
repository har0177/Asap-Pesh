<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Setting extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;

    protected $fillable = [
        'key',
        'value',
        'type',
        'group',
    ];

    protected $casts = [
        'value' => 'array',
    ];

    /**
     * Get a setting value by key
     */
    public static function get(string $key, $default = null)
    {
        $setting = static::where('key', $key)->first();

        if (!$setting) {
            return $default;
        }

        // Handle file types
        if (in_array($setting->type, ['image', 'file']) && $setting->hasMedia('settings')) {
            return $setting->getFirstMediaUrl('settings');
        }

        return $setting->value ?? $default;
    }

    /**
     * Set a setting value by key
     */
    public static function set(string $key, $value, string $type = 'text', string $group = 'general'): self
    {
        return static::updateOrCreate(
            ['key' => $key],
            [
                'value' => $value,
                'type' => $type,
                'group' => $group,
            ]
        );
    }

    /**
     * Get all settings for a group
     */
    public static function getGroup(string $group): array
    {
        return static::where('group', $group)
            ->get()
            ->mapWithKeys(function ($setting) {
                $value = $setting->value;

                // Handle file types
                if (in_array($setting->type, ['image', 'file']) && $setting->hasMedia('settings')) {
                    $value = $setting->getFirstMediaUrl('settings');
                }

                return [$setting->key => $value];
            })
            ->toArray();
    }

    /**
     * Get all settings as a flat array
     */
    public static function getAllSettings(): array
    {
        return static::all()
            ->mapWithKeys(function ($setting) {
                $value = $setting->value;

                // Handle file types
                if (in_array($setting->type, ['image', 'file']) && $setting->hasMedia('settings')) {
                    $value = $setting->getFirstMediaUrl('settings');
                }

                return [$setting->key => $value];
            })
            ->toArray();
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('settings')
            ->singleFile();
    }
}
