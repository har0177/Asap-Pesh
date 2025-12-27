<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\Notify;
use App\Helpers\Response;
use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class SettingController extends Controller
{
    public function index(): InertiaResponse
    {
        $settings = Setting::orderBy('group')->orderBy('order')->get()->map(function ($setting) {
            return [
                'id' => $setting->id,
                'key' => $setting->key,
                'value' => $setting->value,
                'type' => $setting->type,
                'group' => $setting->group,
                'label' => $setting->label,
                'description' => $setting->description,
                'media_url' => $setting->hasMedia('settings') ? $setting->getFirstMediaUrl('settings') : null,
            ];
        });

        // Group settings by their group
        $groupedSettings = $settings->groupBy('group');

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
            'groupedSettings' => $groupedSettings,
            'groups' => [
                'site' => 'Site Settings',
                'contact' => 'Contact Information',
                'social' => 'Social Media',
                'content' => 'Content & Files',
                'diplomas' => 'Diploma Settings',
            ],
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        try {
            $data = $request->validate([
                'settings' => 'required|array',
                'settings.*.key' => 'required|string',
                'settings.*.value' => 'nullable',
            ]);

            foreach ($data['settings'] as $item) {
                $setting = Setting::where('key', $item['key'])->first();
                if ($setting) {
                    $setting->update(['value' => $item['value']]);
                }
            }

            Notify::success('Settings updated successfully.');

            return Response::success(['message' => 'Settings updated successfully']);
        } catch (\Throwable $e) {
            return Response::error($e->getMessage(), 500);
        }
    }

    public function uploadFile(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'key' => 'required|string',
                'file' => 'required|file|max:10240', // 10MB max
            ]);

            $setting = Setting::where('key', $request->key)->first();

            if (!$setting) {
                return Response::error('Setting not found', 404);
            }

            // Clear existing media
            $setting->clearMediaCollection('settings');

            // Add new media
            $media = $setting->addMediaFromRequest('file')
                ->toMediaCollection('settings');

            // Update setting value with the new URL
            $setting->update(['value' => $media->getUrl()]);

            Notify::success('File uploaded successfully.');

            return Response::success([
                'url' => $media->getUrl(),
                'message' => 'File uploaded successfully',
            ]);
        } catch (\Throwable $e) {
            return Response::error($e->getMessage(), 500);
        }
    }

    public function getSetting(string $key): JsonResponse
    {
        $setting = Setting::where('key', $key)->first();

        if (!$setting) {
            return Response::error('Setting not found', 404);
        }

        return Response::success([
            'setting' => [
                'key' => $setting->key,
                'value' => $setting->value,
                'type' => $setting->type,
                'media_url' => $setting->hasMedia('settings') ? $setting->getFirstMediaUrl('settings') : null,
            ],
        ]);
    }

    /**
     * Get all settings for frontend (public API)
     */
    public function getAllSettings(): JsonResponse
    {
        $settings = Setting::getAllSettings();

        return Response::success(['settings' => $settings]);
    }
}
