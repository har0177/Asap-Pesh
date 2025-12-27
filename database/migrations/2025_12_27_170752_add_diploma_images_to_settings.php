<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Setting;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add diploma image settings
        $settings = [
            // DAS (Diploma in Agriculture Sciences) Images
            [
                'key' => 'diploma_das_image_1',
                'value' => '/das/1.jpg',
                'type' => 'image',
                'group' => 'diplomas',
                'label' => 'DAS Image 1',
                'description' => 'First image for Agriculture Sciences diploma page',
                'order' => 10,
            ],
            [
                'key' => 'diploma_das_image_2',
                'value' => '/das/2.jpg',
                'type' => 'image',
                'group' => 'diplomas',
                'label' => 'DAS Image 2',
                'description' => 'Second image for Agriculture Sciences diploma page',
                'order' => 11,
            ],
            [
                'key' => 'diploma_das_image_3',
                'value' => '/das/3.jpg',
                'type' => 'image',
                'group' => 'diplomas',
                'label' => 'DAS Image 3',
                'description' => 'Third image for Agriculture Sciences diploma page',
                'order' => 12,
            ],

            // DVS (Diploma in Veterinary Sciences) Images
            [
                'key' => 'diploma_dvs_image_1',
                'value' => '/dvs/1.jpg',
                'type' => 'image',
                'group' => 'diplomas',
                'label' => 'DVS Image 1',
                'description' => 'First image for Veterinary Sciences diploma page',
                'order' => 13,
            ],
            [
                'key' => 'diploma_dvs_image_2',
                'value' => '/dvs/2.jpg',
                'type' => 'image',
                'group' => 'diplomas',
                'label' => 'DVS Image 2',
                'description' => 'Second image for Veterinary Sciences diploma page',
                'order' => 14,
            ],
            [
                'key' => 'diploma_dvs_image_3',
                'value' => '/dvs/3.jpg',
                'type' => 'image',
                'group' => 'diplomas',
                'label' => 'DVS Image 3',
                'description' => 'Third image for Veterinary Sciences diploma page',
                'order' => 15,
            ],

            // Fee Structure Image
            [
                'key' => 'fee_structure_image',
                'value' => '/fee-structure.jpg',
                'type' => 'image',
                'group' => 'content',
                'label' => 'Fee Structure Image',
                'description' => 'Image displayed on the fee structure page',
                'order' => 4,
            ],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Setting::whereIn('key', [
            'diploma_das_image_1',
            'diploma_das_image_2',
            'diploma_das_image_3',
            'diploma_dvs_image_1',
            'diploma_dvs_image_2',
            'diploma_dvs_image_3',
            'fee_structure_image',
        ])->delete();
    }
};
