<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Content;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add type column if not exists
        if (!Schema::hasColumn('contents', 'type')) {
            Schema::table('contents', function (Blueprint $table) {
                $table->string('type')->nullable()->after('slug');
            });
        }

        // Create diploma content entries
        $diplomas = [
            [
                'title' => 'Diploma in Agriculture Sciences',
                'slug' => 'agriculture-science',
                'type' => 'diploma',
                'description' => 'The Diploma in Agriculture Sciences (DAS) is a comprehensive 3-year program designed to equip students with practical knowledge and skills in modern agricultural practices, crop management, soil science, and sustainable farming techniques.',
                'status' => 'Active',
            ],
            [
                'title' => 'Diploma in Veterinary Sciences',
                'slug' => 'veterinary-science',
                'type' => 'diploma',
                'description' => 'The Diploma in Veterinary Sciences (DVS) is a 3-year professional program focused on animal health, livestock management, disease prevention, and veterinary care practices.',
                'status' => 'Active',
            ],
            [
                'title' => 'Fee Structure',
                'slug' => 'fee-structure',
                'type' => 'page',
                'description' => 'Complete fee details for all diploma programs at Agriculture Services Academy, Peshawar.',
                'status' => 'Active',
            ],
        ];

        foreach ($diplomas as $diploma) {
            Content::updateOrCreate(
                ['slug' => $diploma['slug']],
                $diploma
            );
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Content::whereIn('slug', ['agriculture-science', 'veterinary-science', 'fee-structure'])->delete();

        if (Schema::hasColumn('contents', 'type')) {
            Schema::table('contents', function (Blueprint $table) {
                $table->dropColumn('type');
            });
        }
    }
};
