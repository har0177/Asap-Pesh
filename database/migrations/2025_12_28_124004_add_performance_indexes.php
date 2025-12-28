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
            if (!$this->hasIndex('students', 'students_diploma_id_index')) {
                $table->index('diploma_id');
            }
            if (!$this->hasIndex('students', 'students_session_id_index')) {
                $table->index('session_id');
            }
            if (!$this->hasIndex('students', 'students_section_id_index')) {
                $table->index('section_id');
            }
        });

        // Projects table indexes
        Schema::table('projects', function (Blueprint $table) {
            if (!$this->hasIndex('projects', 'projects_status_index')) {
                $table->index('status');
            }
            if (!$this->hasIndex('projects', 'projects_diploma_id_index')) {
                $table->index('diploma_id');
            }
            if (!$this->hasIndex('projects', 'projects_dates_index')) {
                $table->index(['start_date', 'end_date']);
            }
        });

        // Employees table indexes
        Schema::table('employees', function (Blueprint $table) {
            if (!$this->hasIndex('employees', 'employees_status_index')) {
                $table->index('status');
            }
            if (!$this->hasIndex('employees', 'employees_order_index')) {
                $table->index('order');
            }
        });

        // Educations table indexes
        Schema::table('educations', function (Blueprint $table) {
            if (!$this->hasIndex('educations', 'educations_user_id_index')) {
                $table->index('user_id');
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
            $table->dropIndex(['diploma_id']);
            $table->dropIndex(['session_id']);
            $table->dropIndex(['section_id']);
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['diploma_id']);
            $table->dropIndex(['start_date', 'end_date']);
        });

        Schema::table('employees', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['order']);
        });

        Schema::table('educations', function (Blueprint $table) {
            $table->dropIndex(['user_id']);
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
