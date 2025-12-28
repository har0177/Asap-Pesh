<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Users table indexes
        Schema::table('users', function (Blueprint $table) {
            if (!$this->hasIndex('users', 'users_role_id_index')) {
                $table->index('role_id');
            }
        });

        // Students table indexes
        Schema::table('students', function (Blueprint $table) {
            if (!$this->hasIndex('students', 'students_user_id_index')) {
                $table->index('user_id');
            }
            if (!$this->hasIndex('students', 'students_status_index')) {
                $table->index('status');
            }
        });

        // Applications table indexes
        Schema::table('applications', function (Blueprint $table) {
            if (!$this->hasIndex('applications', 'applications_user_id_index')) {
                $table->index('user_id');
            }
            if (!$this->hasIndex('applications', 'applications_project_id_index')) {
                $table->index('project_id');
            }
            if (!$this->hasIndex('applications', 'applications_status_created_at_index')) {
                $table->index(['status', 'created_at']);
            }
        });

        // Taxonomies table indexes
        Schema::table('taxonomies', function (Blueprint $table) {
            if (!$this->hasIndex('taxonomies', 'taxonomies_type_index')) {
                $table->index('type');
            }
            if (!$this->hasIndex('taxonomies', 'taxonomies_parent_id_index')) {
                $table->index('parent_id');
            }
        });
    }

    /**
     * Check if index exists
     */
    private function hasIndex(string $table, string $indexName): bool
    {
        $indexes = Schema::getIndexes($table);
        foreach ($indexes as $index) {
            if ($index['name'] === $indexName) {
                return true;
            }
        }
        return false;
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['role_id']);
        });

        Schema::table('students', function (Blueprint $table) {
            $table->dropIndex(['user_id']);
            $table->dropIndex(['status']);
        });

        Schema::table('applications', function (Blueprint $table) {
            $table->dropIndex(['user_id']);
            $table->dropIndex(['project_id']);
            $table->dropIndex(['status', 'created_at']);
        });

        Schema::table('taxonomies', function (Blueprint $table) {
            $table->dropIndex(['type']);
            $table->dropIndex(['parent_id']);
        });
    }
};
