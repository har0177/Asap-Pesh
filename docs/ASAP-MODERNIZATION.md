# ASAP Modernization Project - Master Documentation

## Project Goal

**Complete modernization of the ASAP (ASA Peshawar) Educational Management System**

### Objectives
1. **Migrate from Livewire to React + Inertia.js**
2. **Implement Ant Design (antd)** for professional UI/UX
3. **Redesign database schema** (preserve all existing data)
4. **Optimize code** and fix bugs
5. **Professional UI/UX** for both admin and public frontend

---

# PART 1: CURRENT SYSTEM ANALYSIS

## Overview

This is a **full-stack Laravel web application** for managing an educational institution (ASA Peshawar). It serves as both a public-facing website and an administrative portal for student admissions, staff management, and institutional operations.

---

## Technology Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Laravel | 10.10 | PHP Framework |
| Livewire | 3.0 (beta) | Reactive UI Components |
| Jetstream | 3.2 | Authentication Scaffolding |
| Sanctum | 3.2 | API Token Authentication |
| Spatie MediaLibrary | 10.0 | File/Media Management |
| Laravel Excel | 3.1 | Data Export |
| Eloquent Sluggable | 10.0 | URL Slug Generation |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Tailwind CSS | 3.3.3 | Utility-First CSS Framework |
| Alpine.js | 3.12.3 | Lightweight JS Framework |
| Vite | 4.0 | Build Tool |
| jQuery | 3.7.0 | DOM Manipulation |
| Select2 | 4.1.0 | Enhanced Dropdowns |
| Axios | 1.1.2 | HTTP Client |

### Database
- MySQL (default)
- Session-based storage (database driver)

---

## Project Structure

```
asap/
├── app/
│   ├── Actions/           # Fortify/Jetstream actions
│   ├── Enums/             # TaxonomyTypeEnum, ReligionEnum
│   ├── Exports/           # Excel export classes
│   ├── Helper/            # Common helper functions
│   ├── Http/Controllers/  # HomeController, UserController, etc.
│   ├── Livewire/          # 18+ interactive components
│   ├── Mail/              # ContactFormMail
│   ├── Models/            # 13+ Eloquent models
│   ├── Services/          # SmsService
│   ├── Traits/            # HasPermissions
│   └── View/Components/   # AppLayout, GuestLayout
├── config/
│   ├── app.php            # App settings, timezone (Asia/Karachi)
│   ├── auth.php           # Authentication configuration
│   ├── permissions.php    # RBAC permissions definition
│   └── ...
├── database/migrations/   # Database schema
├── resources/
│   ├── css/app.css        # Tailwind entry point
│   ├── js/app.js          # Alpine.js, Livewire initialization
│   └── views/             # Blade templates
├── routes/web.php         # Route definitions
└── public/                # Web-accessible assets
```

---

## Core Features

### 1. Student Management
- Student registration and profile management
- Education history tracking
- Application submission for admission projects
- Student card generation
- Attendance tracking
- Student dashboard

### 2. Admission System
- Project/intake management with quotas
- Application processing (Pending/Paid status)
- Merit list generation with district/quota filtering
- Fee challan management
- SMS notifications to applicants

### 3. Administrative Panel
- **User Management**: CRUD operations with role assignment
- **Role-Based Access Control**: Custom permissions per module
- **Content Management**: Slides, gallery, news/events, course content
- **Employee Directory**: Staff management
- **Taxonomy System**: Configurable categories (diplomas, sections, sessions, districts, quotas, etc.)

### 4. Public Website
- Homepage with slides/banners
- About, Contact, Fee Structure pages
- Merit list display
- Gallery
- Staff directory
- Course content pages
- News & Events

---

## Key Models & Relationships

| Model | Purpose | Key Relationships |
|-------|---------|-------------------|
| User | Authentication (Admin/Student) | hasOne: Student, hasMany: Applications, Education |
| Student | Student profile | belongsTo: User, Taxonomy (diploma, section, session) |
| Application | Admission application | belongsTo: User, Project |
| Project | Admission intake | hasMany: Applications, belongsTo: Taxonomy |
| Taxonomy | Hierarchical categories | parent-child self-referencing |
| Role | User permissions | hasMany: Users, stores JSON permissions |
| Employee | Staff members | belongsTo: Taxonomy (gender, blood group) |
| MeritList | Generated merit lists | belongsTo: User, Project, District, Quota |
| NewsEvents | Announcements | auto-slug generation |
| Content | CMS pages | auto-slug generation |
| Gallery/Slide | Media content | Spatie MediaLibrary |

---

## Livewire Components (Interactive UI)

| Component | Purpose |
|-----------|---------|
| ApplicationList | View/manage student applications |
| StudentList | List and manage students |
| StudentProfile | Student profile editor |
| StudentApply | Application form wizard |
| StudentEducation | Education history form |
| Merit | Merit list generation |
| RoleList | Role management |
| UserList | User management |
| RegisteredUsers | View registered users |
| EmployeeList | Employee management |
| ProjectList | Admission project management |
| TaxonomyList | Category management |
| NewsEventsList | Events management |
| ContentList | CMS content management |
| GalleryList | Gallery management |
| SlideList | Slides/banners management |
| SMS | Send SMS notifications |
| HomePage | Homepage management |

---

## Authentication & Authorization

### User Roles
- `ROLE_ADMIN = 1` - Full administrative access
- `ROLE_STUDENT = 2` - Limited student access

### Permission Modules
- Roles, Users, Students, Employees, Projects
- Applications, Slides, Gallery, News/Events, Taxonomies

### Root User
- Email: `superadmin@asap.edu.pk`

---

## External Integrations

| Service | Configuration |
|---------|---------------|
| SMTP Email | mail.asap.edu.pk:465 (SSL) |
| SMS Gateway | SMSID: rchasapesh, Mask: ASA-Pesh. |
| Media Storage | Local filesystem (media disk) |

---

## Route Summary

### Public Routes
- `/` - Homepage
- `/about`, `/contact`, `/fee-structure`
- `/front-gallery`, `/staff`, `/merit-list`
- `/showEvent/{slug}`, `/course-content/{slug}`

### Student Routes (auth required)
- `/profile`, `/education`, `/apply`
- `/student-card`, `/student-dashboard`, `/attendance`

### Admin Routes (auth + permissions)
- `/admin/roles`, `/admin/users`, `/admin/students`
- `/admin/employees`, `/admin/projects`, `/admin/applications`
- `/admin/slides`, `/admin/gallery`, `/admin/events`
- `/admin/taxonomies`, `/admin/contents`, `/admin/merit-lists`
- `/admin/send-sms`

---

## Configuration Highlights

- **Timezone**: Asia/Karachi
- **Locale**: English
- **Session Driver**: Database
- **File System**: Local media disk
- **Mail**: SMTP with SSL
- **Build Tool**: Vite 4.0

---

## Code Quality Observations

### Strengths
- Clean separation using Livewire components
- Proper use of Laravel conventions (migrations, Eloquent, middleware)
- Role-based access control implementation
- Spatie MediaLibrary for file management
- Tailwind CSS for consistent styling

### Areas to Consider
- Livewire 3.0 is still in beta
- Some inline styles mixed with Tailwind classes
- SMS credentials stored in environment (good practice)

---

## Summary

This is a **well-structured Laravel 10 educational management system** featuring:
- Modern reactive UI with Livewire 3 + Alpine.js
- Comprehensive student admission workflow
- Role-based administrative panel
- Public website with CMS capabilities
- SMS and email notifications
- Tailwind CSS styling

The application effectively manages student admissions, institutional content, and administrative operations for an educational institution in Pakistan.

---

# PART 2: TARGET ARCHITECTURE

## New Technology Stack

### Backend (Keep/Upgrade)
| Technology | Version | Purpose |
|------------|---------|---------|
| Laravel | 10.x → 11.x | PHP Framework (upgrade recommended) |
| Inertia.js | 1.x | Server-side routing with client-side rendering |
| Sanctum | 3.2+ | API Token Authentication |
| Spatie MediaLibrary | 10.0+ | File/Media Management |
| Laravel Excel | 3.1+ | Data Export |

### Frontend (Replace)
| Old | New | Purpose |
|-----|-----|---------|
| Livewire 3 | React 18+ | Component Framework |
| Alpine.js | React Hooks | State Management |
| Tailwind CSS | Ant Design 5.x | UI Component Library |
| Select2 | Ant Design Select | Dropdowns |
| jQuery | Remove | Not needed with React |

### New Stack Summary
```
Laravel 10/11 + Inertia.js + React 18 + Ant Design 5 + TypeScript
```

---

## New Project Structure

```
asap/
├── app/
│   ├── Http/
│   │   ├── Controllers/          # Inertia Controllers
│   │   │   ├── Admin/            # Admin module controllers
│   │   │   ├── Student/          # Student module controllers
│   │   │   └── Public/           # Public page controllers
│   │   ├── Middleware/
│   │   ├── Requests/             # Form Request validation
│   │   └── Resources/            # API Resources (JSON transformation)
│   ├── Models/                   # Eloquent Models (redesigned)
│   ├── Services/                 # Business Logic Services
│   ├── Repositories/             # Data Access Layer (new)
│   ├── Actions/                  # Single-action classes
│   └── Enums/                    # PHP Enums
├── resources/
│   ├── js/
│   │   ├── app.tsx              # React entry point
│   │   ├── Pages/               # Inertia page components
│   │   │   ├── Admin/           # Admin pages
│   │   │   │   ├── Dashboard/
│   │   │   │   ├── Users/
│   │   │   │   ├── Students/
│   │   │   │   ├── Applications/
│   │   │   │   ├── Projects/
│   │   │   │   ├── Employees/
│   │   │   │   ├── Content/
│   │   │   │   ├── Gallery/
│   │   │   │   ├── Settings/
│   │   │   │   └── Reports/
│   │   │   ├── Student/         # Student portal pages
│   │   │   │   ├── Dashboard/
│   │   │   │   ├── Profile/
│   │   │   │   ├── Applications/
│   │   │   │   └── Documents/
│   │   │   ├── Public/          # Public website pages
│   │   │   │   ├── Home/
│   │   │   │   ├── About/
│   │   │   │   ├── Contact/
│   │   │   │   ├── Gallery/
│   │   │   │   └── MeritList/
│   │   │   └── Auth/            # Authentication pages
│   │   ├── Components/          # Reusable React components
│   │   │   ├── Layout/          # Layout components
│   │   │   ├── Forms/           # Form components
│   │   │   ├── Tables/          # Table components
│   │   │   ├── Cards/           # Card components
│   │   │   └── Common/          # Shared components
│   │   ├── Hooks/               # Custom React hooks
│   │   ├── Context/             # React Context providers
│   │   ├── Utils/               # Utility functions
│   │   └── Types/               # TypeScript types
│   └── css/
│       └── app.css              # Ant Design customization
├── routes/
│   ├── web.php                  # Main routes (Inertia)
│   ├── admin.php                # Admin routes
│   ├── student.php              # Student routes
│   └── api.php                  # API routes
└── database/
    ├── migrations/              # New schema migrations
    └── seeders/                 # Data seeders
```

---

# PART 3: DATABASE REDESIGN

## Current Schema Issues to Address
1. **Taxonomy table overloaded** - stores too many unrelated categories
2. **Denormalized data** - some fields duplicated across tables
3. **Missing indexes** - slow queries on large datasets
4. **Inconsistent naming** - mixed naming conventions
5. **No audit logging** - no tracking of changes

## New Database Schema

### Core Tables

#### 1. users (Redesigned)
```sql
CREATE TABLE users (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    uuid CHAR(36) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NULL,
    avatar_path VARCHAR(255) NULL,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    two_factor_secret TEXT NULL,
    two_factor_recovery_codes TEXT NULL,
    two_factor_confirmed_at TIMESTAMP NULL,
    remember_token VARCHAR(100) NULL,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);
```

#### 2. roles (Redesigned)
```sql
CREATE TABLE roles (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT NULL,
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    module VARCHAR(50) NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_module (module)
);

CREATE TABLE role_permissions (
    role_id BIGINT UNSIGNED NOT NULL,
    permission_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

CREATE TABLE user_roles (
    user_id BIGINT UNSIGNED NOT NULL,
    role_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);
```

#### 3. students (Redesigned)
```sql
CREATE TABLE students (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,
    registration_number VARCHAR(50) UNIQUE NULL,
    father_name VARCHAR(100) NOT NULL,
    cnic VARCHAR(15) UNIQUE NOT NULL,
    date_of_birth DATE NOT NULL,
    gender_id BIGINT UNSIGNED NOT NULL,
    religion ENUM('islam', 'minority') NOT NULL,
    blood_group_id BIGINT UNSIGNED NULL,
    domicile_district_id BIGINT UNSIGNED NOT NULL,
    province_id BIGINT UNSIGNED NOT NULL,
    permanent_address TEXT NOT NULL,
    current_address TEXT NULL,
    emergency_contact VARCHAR(20) NULL,
    admission_session_id BIGINT UNSIGNED NULL,
    program_id BIGINT UNSIGNED NULL,
    section_id BIGINT UNSIGNED NULL,
    enrollment_status ENUM('pending', 'enrolled', 'graduated', 'dropped') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (gender_id) REFERENCES genders(id),
    FOREIGN KEY (blood_group_id) REFERENCES blood_groups(id),
    FOREIGN KEY (domicile_district_id) REFERENCES districts(id),
    FOREIGN KEY (province_id) REFERENCES provinces(id),
    FOREIGN KEY (admission_session_id) REFERENCES academic_sessions(id),
    FOREIGN KEY (program_id) REFERENCES programs(id),
    FOREIGN KEY (section_id) REFERENCES sections(id),

    INDEX idx_registration (registration_number),
    INDEX idx_cnic (cnic),
    INDEX idx_enrollment (enrollment_status)
);
```

#### 4. Lookup Tables (Replace Taxonomy)
```sql
-- Instead of one Taxonomy table, create separate normalized tables:

CREATE TABLE provinces (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE districts (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    province_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (province_id) REFERENCES provinces(id),
    INDEX idx_province (province_id)
);

CREATE TABLE genders (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL,
    code VARCHAR(5) UNIQUE NOT NULL
);

CREATE TABLE blood_groups (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(10) NOT NULL,
    code VARCHAR(5) UNIQUE NOT NULL
);

CREATE TABLE programs (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    duration_years TINYINT NOT NULL,
    description TEXT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE academic_sessions (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,

    INDEX idx_current (is_current),
    INDEX idx_dates (start_date, end_date)
);

CREATE TABLE sections (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE quotas (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    percentage DECIMAL(5,2) NULL,
    description TEXT NULL,
    is_active BOOLEAN DEFAULT TRUE
);
```

#### 5. education_records (Redesigned)
```sql
CREATE TABLE education_records (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    degree_type ENUM('matric', 'intermediate', 'bachelor', 'master', 'other') NOT NULL,
    degree_name VARCHAR(200) NOT NULL,
    board_university VARCHAR(200) NOT NULL,
    passing_year YEAR NOT NULL,
    roll_number VARCHAR(50) NULL,
    total_marks INT UNSIGNED NOT NULL,
    obtained_marks INT UNSIGNED NOT NULL,
    percentage DECIMAL(5,2) GENERATED ALWAYS AS (obtained_marks * 100.0 / total_marks) STORED,
    grade VARCHAR(10) NULL,
    document_path VARCHAR(255) NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_degree (degree_type)
);
```

#### 6. admission_projects (Redesigned)
```sql
CREATE TABLE admission_projects (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    program_id BIGINT UNSIGNED NOT NULL,
    session_id BIGINT UNSIGNED NOT NULL,
    total_seats INT UNSIGNED NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    fee_amount DECIMAL(10,2) NOT NULL,
    status ENUM('draft', 'open', 'closed', 'completed') DEFAULT 'draft',
    description TEXT NULL,
    requirements TEXT NULL,
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (program_id) REFERENCES programs(id),
    FOREIGN KEY (session_id) REFERENCES academic_sessions(id),
    FOREIGN KEY (created_by) REFERENCES users(id),

    INDEX idx_status (status),
    INDEX idx_dates (start_date, end_date)
);

CREATE TABLE project_quotas (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    project_id BIGINT UNSIGNED NOT NULL,
    quota_id BIGINT UNSIGNED NOT NULL,
    seats INT UNSIGNED NOT NULL,

    FOREIGN KEY (project_id) REFERENCES admission_projects(id) ON DELETE CASCADE,
    FOREIGN KEY (quota_id) REFERENCES quotas(id),
    UNIQUE KEY unique_project_quota (project_id, quota_id)
);
```

#### 7. applications (Redesigned)
```sql
CREATE TABLE applications (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    application_number VARCHAR(50) UNIQUE NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    project_id BIGINT UNSIGNED NOT NULL,
    quota_id BIGINT UNSIGNED NULL,
    status ENUM('draft', 'submitted', 'under_review', 'payment_pending', 'paid', 'accepted', 'rejected', 'waitlisted') DEFAULT 'draft',
    payment_status ENUM('unpaid', 'pending', 'paid', 'refunded') DEFAULT 'unpaid',
    payment_amount DECIMAL(10,2) NULL,
    payment_date TIMESTAMP NULL,
    payment_reference VARCHAR(100) NULL,
    challan_number VARCHAR(50) NULL,
    merit_score DECIMAL(6,2) NULL,
    merit_rank INT UNSIGNED NULL,
    remarks TEXT NULL,
    submitted_at TIMESTAMP NULL,
    reviewed_at TIMESTAMP NULL,
    reviewed_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (project_id) REFERENCES admission_projects(id),
    FOREIGN KEY (quota_id) REFERENCES quotas(id),
    FOREIGN KEY (reviewed_by) REFERENCES users(id),

    INDEX idx_user (user_id),
    INDEX idx_project (project_id),
    INDEX idx_status (status),
    INDEX idx_payment (payment_status),
    INDEX idx_merit (merit_score DESC)
);
```

#### 8. employees (Redesigned)
```sql
CREATE TABLE employees (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NULL,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    father_name VARCHAR(100) NULL,
    cnic VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(255) NULL,
    phone VARCHAR(20) NULL,
    gender_id BIGINT UNSIGNED NOT NULL,
    date_of_birth DATE NULL,
    blood_group_id BIGINT UNSIGNED NULL,
    designation VARCHAR(100) NOT NULL,
    department VARCHAR(100) NULL,
    employment_type ENUM('permanent', 'contract', 'visiting') DEFAULT 'permanent',
    joining_date DATE NOT NULL,
    address TEXT NULL,
    photo_path VARCHAR(255) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (gender_id) REFERENCES genders(id),
    FOREIGN KEY (blood_group_id) REFERENCES blood_groups(id),

    INDEX idx_employee_id (employee_id),
    INDEX idx_department (department),
    INDEX idx_active (is_active)
);
```

#### 9. CMS Tables
```sql
CREATE TABLE pages (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    content LONGTEXT NULL,
    meta_title VARCHAR(200) NULL,
    meta_description TEXT NULL,
    featured_image VARCHAR(255) NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    published_at TIMESTAMP NULL,
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_slug (slug),
    INDEX idx_status (status)
);

CREATE TABLE news_events (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    content LONGTEXT NULL,
    excerpt TEXT NULL,
    type ENUM('news', 'event', 'announcement') NOT NULL,
    featured_image VARCHAR(255) NULL,
    event_date DATE NULL,
    event_location VARCHAR(200) NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP NULL,
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_slug (slug),
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_featured (is_featured)
);

CREATE TABLE slides (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NULL,
    subtitle TEXT NULL,
    image_path VARCHAR(255) NOT NULL,
    link_url VARCHAR(255) NULL,
    link_text VARCHAR(100) NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_active_order (is_active, sort_order)
);

CREATE TABLE galleries (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE gallery_images (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    gallery_id BIGINT UNSIGNED NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    caption VARCHAR(200) NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (gallery_id) REFERENCES galleries(id) ON DELETE CASCADE,
    INDEX idx_gallery_order (gallery_id, sort_order)
);
```

#### 10. Audit & Activity Logging
```sql
CREATE TABLE activity_logs (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NULL,
    action VARCHAR(50) NOT NULL,
    model_type VARCHAR(100) NOT NULL,
    model_id BIGINT UNSIGNED NOT NULL,
    old_values JSON NULL,
    new_values JSON NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_model (model_type, model_id),
    INDEX idx_created (created_at)
);
```

## Data Migration Strategy

### Step 1: Backup
```bash
# Full database backup before migration
mysqldump -u root -p asap > asap_backup_$(date +%Y%m%d).sql
```

### Step 2: Create New Schema
- Run new migrations in a transaction
- Keep old tables temporarily (prefix with `old_`)

### Step 3: Data Migration Scripts
Create Laravel commands for each migration:
```php
php artisan migrate:taxonomy-to-lookups    # Split taxonomy into separate tables
php artisan migrate:users-data             # Migrate user data
php artisan migrate:students-data          # Migrate student data
php artisan migrate:applications-data      # Migrate applications
php artisan migrate:content-data           # Migrate CMS content
```

### Step 4: Verify Data Integrity
- Row count comparison
- Relationship integrity checks
- Sample data verification

### Step 5: Cleanup
- Remove old tables after verification
- Update sequences/auto-increment values

---

# PART 4: UI/UX DESIGN SYSTEM

## Ant Design Theme Configuration

### Color Palette
```typescript
// theme/config.ts
export const theme = {
  token: {
    colorPrimary: '#1890ff',        // Primary blue
    colorSuccess: '#52c41a',         // Success green
    colorWarning: '#faad14',         // Warning yellow
    colorError: '#ff4d4f',           // Error red
    colorInfo: '#1890ff',            // Info blue

    // Typography
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: 14,

    // Border radius
    borderRadius: 6,

    // Spacing
    padding: 16,
    margin: 16,
  },
  components: {
    Layout: {
      siderBg: '#001529',
      headerBg: '#fff',
    },
    Menu: {
      darkItemBg: '#001529',
      darkItemSelectedBg: '#1890ff',
    },
  },
};
```

## Layout Components

### Admin Layout
```
┌────────────────────────────────────────────────────────────┐
│  Logo    │  Search Bar           │  Notifications │ User  │
├──────────┼───────────────────────────────────────────────────┤
│          │                                                  │
│  Menu    │  Breadcrumb                                     │
│          │  ─────────────────────────────────────────────   │
│  - Dash  │                                                  │
│  - Users │              Page Content                       │
│  - Stud  │                                                  │
│  - Apps  │                                                  │
│  - Proj  │                                                  │
│  - CMS   │                                                  │
│  - Sett  │                                                  │
│          │                                                  │
├──────────┴───────────────────────────────────────────────────┤
│  Footer: © 2024 ASA Peshawar                                │
└────────────────────────────────────────────────────────────┘
```

### Public Layout
```
┌────────────────────────────────────────────────────────────┐
│  Logo         │  Navigation Menu        │  Login │ Apply  │
├───────────────────────────────────────────────────────────────┤
│                                                              │
│                      Hero Slider                             │
│                                                              │
├───────────────────────────────────────────────────────────────┤
│                                                              │
│                    Page Content                              │
│                                                              │
├───────────────────────────────────────────────────────────────┤
│  Footer: Contact Info  │  Quick Links  │  Social Media      │
└────────────────────────────────────────────────────────────┘
```

## Key UI Components

### Admin Module Components
| Component | Ant Design Components Used |
|-----------|---------------------------|
| Data Tables | Table, Pagination, Input.Search, Button, Dropdown |
| Forms | Form, Input, Select, DatePicker, Upload, Switch |
| Modals | Modal, Drawer, Popconfirm |
| Cards | Card, Statistic, Descriptions |
| Navigation | Menu, Breadcrumb, Tabs |
| Feedback | Message, Notification, Alert, Spin |

### Form Patterns
- Use Form.Item with validation rules
- Consistent label placement (top)
- Clear error messages
- Loading states on submit

### Table Patterns
- Search/filter bar at top
- Action buttons (View, Edit, Delete)
- Bulk actions
- Pagination with size options
- Sortable columns
- Responsive design

---

# PART 5: IMPLEMENTATION PHASES

## Phase 1: Foundation Setup
**Files to Create/Modify:**
- `package.json` - Add React, Inertia, Ant Design dependencies
- `vite.config.js` - Configure for React/TypeScript
- `tsconfig.json` - TypeScript configuration
- `resources/js/app.tsx` - React entry point
- `resources/js/types/` - TypeScript type definitions
- `app/Http/Middleware/HandleInertiaRequests.php` - Inertia middleware

**Tasks:**
1. Install Inertia.js server-side (Laravel adapter)
2. Install React and Inertia client-side
3. Install Ant Design and configure theme
4. Set up TypeScript
5. Create base layout components
6. Configure Vite for React

## Phase 2: Database Migration
**Files to Create:**
- `database/migrations/` - New schema migrations
- `app/Console/Commands/` - Data migration commands
- `database/seeders/` - Updated seeders

**Tasks:**
1. Create new migration files for redesigned schema
2. Create data migration commands
3. Backup existing data
4. Run migrations
5. Migrate data from old to new tables
6. Verify data integrity

## Phase 3: Core Backend Updates
**Files to Modify/Create:**
- `app/Models/` - Update Eloquent models
- `app/Http/Controllers/` - Convert to Inertia controllers
- `app/Http/Resources/` - Create API resources
- `app/Http/Requests/` - Form request validation
- `routes/web.php` - Update routes

**Tasks:**
1. Update models for new schema
2. Create Inertia controllers
3. Create form request validation classes
4. Set up API resources for data transformation
5. Update routes for Inertia

## Phase 4: Authentication Module
**Files to Create:**
- `resources/js/Pages/Auth/` - Login, Register, ForgotPassword, ResetPassword
- `resources/js/Components/Auth/` - Auth form components

**Tasks:**
1. Create login page with Ant Design
2. Create registration page
3. Create password reset flow
4. Implement two-factor authentication UI
5. Create protected route handling

## Phase 5: Admin Dashboard
**Files to Create:**
- `resources/js/Pages/Admin/Dashboard/`
- `resources/js/Components/Dashboard/` - Stats cards, charts

**Tasks:**
1. Create dashboard layout
2. Add statistics cards
3. Add recent activity widget
4. Add quick actions

## Phase 6: User Management Module
**Files to Create:**
- `resources/js/Pages/Admin/Users/` - Index, Create, Edit, Show
- `resources/js/Pages/Admin/Roles/` - Index, Create, Edit
- `app/Http/Controllers/Admin/UserController.php`
- `app/Http/Controllers/Admin/RoleController.php`

**Tasks:**
1. User listing with search, filter, pagination
2. User create/edit forms
3. Role management
4. Permission assignment UI

## Phase 7: Student Management Module
**Files to Create:**
- `resources/js/Pages/Admin/Students/`
- `resources/js/Pages/Student/Profile/`
- `resources/js/Pages/Student/Dashboard/`
- `app/Http/Controllers/Admin/StudentController.php`
- `app/Http/Controllers/Student/ProfileController.php`

**Tasks:**
1. Student listing and search
2. Student profile view/edit
3. Student dashboard
4. Education records management

## Phase 8: Admission Module
**Files to Create:**
- `resources/js/Pages/Admin/Projects/`
- `resources/js/Pages/Admin/Applications/`
- `resources/js/Pages/Admin/MeritList/`
- `resources/js/Pages/Student/Apply/`

**Tasks:**
1. Admission project management
2. Application workflow
3. Payment processing UI
4. Merit list generation

## Phase 9: CMS Module
**Files to Create:**
- `resources/js/Pages/Admin/Content/` - Pages, News, Events
- `resources/js/Pages/Admin/Media/` - Gallery, Slides

**Tasks:**
1. Page editor with rich text
2. News/Events management
3. Gallery management
4. Slide/banner management

## Phase 10: Public Website
**Files to Create:**
- `resources/js/Pages/Public/` - Home, About, Contact, Gallery, MeritList
- `resources/js/Components/Public/` - Header, Footer, Hero

**Tasks:**
1. Home page with hero slider
2. About page
3. Contact page with form
4. Gallery page
5. Merit list display
6. Staff directory
7. News/Events listing

## Phase 11: Reports & Export
**Files to Create:**
- `resources/js/Pages/Admin/Reports/`
- `app/Exports/` - Updated export classes

**Tasks:**
1. Application reports
2. Student reports
3. Merit list export
4. PDF generation

## Phase 12: Testing & Optimization
**Tasks:**
1. Unit tests for models and services
2. Feature tests for controllers
3. Frontend component tests
4. Performance optimization
5. Security audit
6. Code cleanup

---

# PART 6: FILE REFERENCE

## Critical Files to Modify

### Backend (Laravel)
| File | Purpose |
|------|---------|
| `composer.json` | Add inertiajs/inertia-laravel |
| `app/Http/Kernel.php` | Add Inertia middleware |
| `app/Http/Middleware/HandleInertiaRequests.php` | Shared data |
| `config/app.php` | App configuration |
| `routes/web.php` | Inertia routes |

### Frontend (React)
| File | Purpose |
|------|---------|
| `package.json` | React, Inertia, Ant Design deps |
| `vite.config.js` | React configuration |
| `tsconfig.json` | TypeScript config |
| `resources/js/app.tsx` | React entry point |
| `resources/js/Pages/` | Page components |
| `resources/js/Components/` | Shared components |

### Database
| File | Purpose |
|------|---------|
| `database/migrations/` | Schema changes |
| `app/Models/` | Updated Eloquent models |

---

# PART 7: COMMANDS REFERENCE

## Setup Commands
```bash
# Install Inertia server-side
composer require inertiajs/inertia-laravel

# Install frontend dependencies
npm install react react-dom @inertiajs/react
npm install antd @ant-design/icons
npm install typescript @types/react @types/react-dom
npm install -D @vitejs/plugin-react

# Run database migrations
php artisan migrate

# Build frontend
npm run build
```

## Development Commands
```bash
# Start development server
npm run dev

# Start Laravel server
php artisan serve

# Clear caches
php artisan optimize:clear

# Run tests
php artisan test
```

---

# PART 8: CONTINUING WORK INSTRUCTIONS

## For Future Claude Sessions

When continuing this project, follow these steps:

1. **Read this documentation first** - Understand the current state and goals
2. **Check current progress** - Look at completed phases and current state
3. **Review code changes** - Check git log for recent changes
4. **Continue from last phase** - Pick up where previous session left off

## Progress Tracking

Mark phases as you complete them:
- [x] Phase 1: Foundation Setup (COMPLETED - Dec 24, 2024)
- [ ] Phase 2: Database Migration
- [x] Phase 3: Core Backend Updates (PARTIAL - Dec 24, 2024)
- [ ] Phase 4: Authentication Module
- [x] Phase 5: Admin Dashboard (COMPLETED - Dec 24, 2024)
- [x] Phase 6: User Management (INDEX COMPLETED - Dec 24, 2024)
- [x] Phase 7: Student Management (INDEX COMPLETED - Dec 24, 2024)
- [x] Phase 8: Admission Module (INDEX PAGES COMPLETED - Dec 24, 2024)
- [ ] Phase 9: CMS Module
- [x] Phase 10: Public Website (HOME PAGE COMPLETED - Dec 24, 2024)
- [ ] Phase 11: Reports & Export
- [ ] Phase 12: Testing & Optimization

---

## Session 1 Summary (Dec 24, 2024 - Foundation)

**Completed Tasks:**
1. Installed Inertia.js Laravel adapter (v2.0)
2. Installed React 18 and Inertia client
3. Installed Ant Design 5.x and icons
4. Configured Vite for React
5. Created React entry point with Ant Design ConfigProvider
6. Created HandleInertiaRequests middleware
7. Created base layouts: AdminLayout, PublicLayout, AuthLayout
8. Created Ant Design theme configuration
9. Created sample pages: Admin Dashboard, Public Welcome

---

## Session 2 Summary (Dec 24, 2024 - Dynamic Pages & Controllers)

**Major Changes:**
1. Converted from TypeScript (.tsx) to JavaScript (.jsx)
2. Created full Admin controllers with dynamic data
3. Created Public controllers with dynamic data
4. Created Admin index pages with search, filter, pagination
5. Updated Welcome page with dynamic sections

**Backend Controllers Created:**
- `app/Http/Controllers/Admin/DashboardController.php` - Dashboard stats, recent data
- `app/Http/Controllers/Admin/UserController.php` - Full CRUD with search/filter
- `app/Http/Controllers/Admin/StudentController.php` - Full CRUD with taxonomy filters
- `app/Http/Controllers/Admin/ApplicationController.php` - CRUD with status updates
- `app/Http/Controllers/Admin/ProjectController.php` - Full CRUD with application stats
- `app/Http/Controllers/PublicSite/HomeController.php` - Home, about, contact, gallery, staff, events

**Routes Created:**
- `routes/inertia.php` - New React routes with `/v2` prefix
  - Public: `/v2`, `/v2/about`, `/v2/contact`, `/v2/gallery`, `/v2/staff`, `/v2/merit-list`
  - Admin: `/v2/admin/dashboard`, `/v2/admin/users`, `/v2/admin/students`, `/v2/admin/applications`, `/v2/admin/projects`

**Frontend Files Created (JSX):**
```
resources/js/
├── app.jsx                          # React entry point
├── theme.js                         # Ant Design theme config
├── Layouts/
│   ├── AdminLayout.jsx              # Admin sidebar layout
│   ├── PublicLayout.jsx             # Public website layout
│   └── AuthLayout.jsx               # Auth pages layout
└── Pages/
    ├── Admin/
    │   ├── Dashboard.jsx            # Dynamic dashboard with stats
    │   ├── Users/
    │   │   └── Index.jsx            # User listing with CRUD
    │   ├── Students/
    │   │   └── Index.jsx            # Student listing with CRUD
    │   ├── Applications/
    │   │   └── Index.jsx            # Application listing with CRUD
    │   └── Projects/
    │       └── Index.jsx            # Project listing with CRUD
    └── Public/
        └── Welcome.jsx              # Dynamic homepage
```

**Configuration Changes:**
- `package.json` - Added `"type": "module"` and Vite scripts (`yarn dev`, `yarn build`)
- `vite.config.js` - Configured for React/JSX
- `postcss.config.js` → `postcss.config.cjs` (CommonJS compatibility)
- `tailwind.config.js` → `tailwind.config.cjs` (CommonJS compatibility)
- `app/Providers/RouteServiceProvider.php` - Added inertia.php routes

**Features Implemented:**
1. **Admin Dashboard**: Stats cards, recent applications table, active projects list, recent users
2. **Users Index**: Search, role filter, status filter, pagination, CRUD actions
3. **Students Index**: Search, diploma/session/section filters, pagination, CRUD actions
4. **Applications Index**: Search, project/status filters, pagination, view/delete actions
5. **Projects Index**: Search, diploma/status filters, seats progress, pagination, CRUD actions
6. **Public Homepage**: Hero carousel, features section, active admissions, news/events, gallery preview, faculty section

**Access URLs:**
- Public Homepage: `/v2`
- Admin Dashboard: `/v2/admin/dashboard`
- Users Management: `/v2/admin/users`
- Students Management: `/v2/admin/students`
- Applications Management: `/v2/admin/applications`
- Projects Management: `/v2/admin/projects`

**Build Verified:** `yarn build` successful

---

## Next Steps for Future Sessions

### Immediate Tasks:
1. Create remaining CRUD pages (Create, Edit, Show) for Users, Students, Applications, Projects
2. Create Auth pages (Login, Register, Password Reset)
3. Implement form validation and error handling
4. Add flash message notifications

### Pending Features:
1. Role management pages
2. Employee management pages
3. CMS pages (Slides, Gallery, Events, Content)
4. Student portal pages
5. Merit list generation
6. Reports and exports

### Commands to Run:
```bash
# Start development
yarn dev

# Build for production
yarn build

# Start Laravel server
php artisan serve
```

## Important Notes

1. **Data Preservation**: Never delete data without backup
2. **Incremental Changes**: Small commits, frequent testing
3. **Backward Compatibility**: Old Livewire routes still work, new routes use `/v2` prefix
4. **Testing**: Test each module before moving to next
5. **Branch**: Development is on `v2` branch

---

*Last Updated: December 24, 2024*
*Status: Phase 1, 3, 5-8, 10 Partial - Core Admin Index Pages & Public Homepage Complete*
*Git Branch: v2*
