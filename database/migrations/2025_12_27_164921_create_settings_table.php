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
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('type')->default('text'); // text, textarea, image, file, boolean, number
            $table->string('group')->default('general'); // general, site, contact, social, content
            $table->string('label')->nullable();
            $table->text('description')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();

            $table->index('group');
        });

        // Seed default settings
        $this->seedDefaultSettings();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }

    /**
     * Seed default settings
     */
    private function seedDefaultSettings(): void
    {
        $settings = [
            // Site Settings
            ['key' => 'site_name', 'value' => 'Agriculture Services Academy, Peshawar', 'type' => 'text', 'group' => 'site', 'label' => 'Site Name', 'order' => 1],
            ['key' => 'site_tagline', 'value' => 'Excellence in Agricultural & Veterinary Education Since 1954', 'type' => 'text', 'group' => 'site', 'label' => 'Site Tagline', 'order' => 2],
            ['key' => 'site_short_name', 'value' => 'ASA Peshawar', 'type' => 'text', 'group' => 'site', 'label' => 'Short Name', 'order' => 3],
            ['key' => 'site_logo', 'value' => '/images/logo.jpeg', 'type' => 'image', 'group' => 'site', 'label' => 'Site Logo', 'order' => 4],
            ['key' => 'site_logo_sm', 'value' => '/images/logo-sm.png', 'type' => 'image', 'group' => 'site', 'label' => 'Small Logo (Footer)', 'order' => 5],
            ['key' => 'site_favicon', 'value' => '/favicon.ico', 'type' => 'image', 'group' => 'site', 'label' => 'Favicon', 'order' => 6],
            ['key' => 'site_100_years', 'value' => '/images/100-years.png', 'type' => 'image', 'group' => 'site', 'label' => '100 Years Badge', 'order' => 7],

            // Contact Settings
            ['key' => 'contact_email', 'value' => 'admission@asap.edu.pk', 'type' => 'text', 'group' => 'contact', 'label' => 'Email Address', 'order' => 1],
            ['key' => 'contact_phone', 'value' => '091-9224234', 'type' => 'text', 'group' => 'contact', 'label' => 'Phone Number', 'order' => 2],
            ['key' => 'contact_address', 'value' => 'Agriculture Services Academy, Opposite Islamia College, Jamrud Road, Peshawar, KPK, Pakistan', 'type' => 'textarea', 'group' => 'contact', 'label' => 'Address', 'order' => 3],
            ['key' => 'contact_map_url', 'value' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.123456!2d71.123456!3d34.123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sASA+Peshawar!5e0!3m2!1sen!2s!4v1234567890', 'type' => 'textarea', 'group' => 'contact', 'label' => 'Google Maps Embed URL', 'order' => 4],

            // Social Media
            ['key' => 'social_facebook', 'value' => '#', 'type' => 'text', 'group' => 'social', 'label' => 'Facebook URL', 'order' => 1],
            ['key' => 'social_twitter', 'value' => '#', 'type' => 'text', 'group' => 'social', 'label' => 'Twitter URL', 'order' => 2],
            ['key' => 'social_linkedin', 'value' => '#', 'type' => 'text', 'group' => 'social', 'label' => 'LinkedIn URL', 'order' => 3],
            ['key' => 'social_youtube', 'value' => '#', 'type' => 'text', 'group' => 'social', 'label' => 'YouTube URL', 'order' => 4],

            // Content Settings
            ['key' => 'footer_about', 'value' => 'The Agriculture Science & Animal Products Academy is committed to providing quality education in agricultural and veterinary sciences, fostering the next generation of industry leaders.', 'type' => 'textarea', 'group' => 'content', 'label' => 'Footer About Text', 'order' => 1],
            ['key' => 'prospectus_file', 'value' => '/Prospectus.pdf', 'type' => 'file', 'group' => 'content', 'label' => 'Prospectus PDF', 'order' => 2],
            ['key' => 'fee_structure_image', 'value' => '/fee-structure.jpg', 'type' => 'image', 'group' => 'content', 'label' => 'Fee Structure Image', 'order' => 3],

            // Diploma Agriculture Sciences Content
            ['key' => 'diploma_das_title', 'value' => 'Diploma in Agriculture Sciences', 'type' => 'text', 'group' => 'diplomas', 'label' => 'DAS Title', 'order' => 1],
            ['key' => 'diploma_das_description', 'value' => 'The Diploma in Agriculture Sciences (DAS) is a comprehensive 3-year program designed to equip students with practical knowledge and skills in modern agricultural practices, crop management, soil science, and sustainable farming techniques.', 'type' => 'textarea', 'group' => 'diplomas', 'label' => 'DAS Description', 'order' => 2],
            ['key' => 'diploma_das_duration', 'value' => '3 Years', 'type' => 'text', 'group' => 'diplomas', 'label' => 'DAS Duration', 'order' => 3],
            ['key' => 'diploma_das_eligibility', 'value' => 'Matric (Science)', 'type' => 'text', 'group' => 'diplomas', 'label' => 'DAS Eligibility', 'order' => 4],

            // Diploma Veterinary Sciences Content
            ['key' => 'diploma_dvs_title', 'value' => 'Diploma in Veterinary Sciences', 'type' => 'text', 'group' => 'diplomas', 'label' => 'DVS Title', 'order' => 5],
            ['key' => 'diploma_dvs_description', 'value' => 'The Diploma in Veterinary Sciences (DVS) is a 3-year professional program focused on animal health, livestock management, disease prevention, and veterinary care practices.', 'type' => 'textarea', 'group' => 'diplomas', 'label' => 'DVS Description', 'order' => 6],
            ['key' => 'diploma_dvs_duration', 'value' => '3 Years', 'type' => 'text', 'group' => 'diplomas', 'label' => 'DVS Duration', 'order' => 7],
            ['key' => 'diploma_dvs_eligibility', 'value' => 'Matric (Science)', 'type' => 'text', 'group' => 'diplomas', 'label' => 'DVS Eligibility', 'order' => 8],
        ];

        foreach ($settings as $setting) {
            Setting::create($setting);
        }
    }
};
