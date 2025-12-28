# Production Readiness Checklist - ASA Peshawar

## Critical Issues (Must Fix Before Production)

### 1. Security Issues

- [ ] **Remove console.log statements** (10+ files affected)
  ```bash
  # Files to fix:
  resources/js/Pages/Admin/Applications/ApplicationModal.jsx
  resources/js/Pages/Admin/CMS/Content/ContentModal.jsx
  resources/js/Pages/Admin/CMS/Gallery/GalleryModal.jsx
  resources/js/Pages/Admin/CMS/Slides/SlideModal.jsx
  resources/js/Pages/Admin/Employees/EmployeeModal.jsx
  resources/js/Pages/Admin/Projects/ProjectModal.jsx
  resources/js/Pages/Admin/Roles/RoleModal.jsx
  resources/js/Pages/Admin/Students/StudentModal.jsx
  resources/js/Pages/Admin/Users/UserModal.jsx
  resources/js/Pages/Public/Contact.jsx
  ```

- [ ] **Sanitize HTML content** (XSS vulnerability)
  ```bash
  # Install DOMPurify
  yarn add dompurify

  # Files using dangerouslySetInnerHTML:
  resources/js/Pages/Public/EventDetail.jsx
  resources/js/Pages/Public/About.jsx
  resources/js/Pages/Admin/CMS/Content/Show.jsx
  ```

- [ ] **Fix N+1 query in Application model**
  ```php
  // app/Models/Application.php - getQuotaNameAttribute()
  // Change from loop with individual queries to:
  protected function getQuotaNameAttribute() {
      $quotaIds = is_array($this->quota) ? $this->quota : [];
      if (empty($quotaIds)) return [];
      return Taxonomy::whereIn('id', $quotaIds)->pluck('name')->toArray();
  }
  ```

### 2. Environment Configuration

- [ ] **Create production .env file**
  ```env
  APP_ENV=production
  APP_DEBUG=false
  APP_URL=https://your-production-domain.com

  # Use strong session settings
  SESSION_DRIVER=database
  SESSION_LIFETIME=480
  SESSION_ENCRYPT=true

  # Use Redis for cache in production
  CACHE_DRIVER=redis
  QUEUE_CONNECTION=redis
  ```

- [ ] **Never commit .env to git** - ensure `.env` is in `.gitignore`

### 3. Database Optimization

- [ ] **Add missing indexes**
  ```bash
  php artisan make:migration add_performance_indexes
  ```
  ```php
  // In the migration:
  Schema::table('users', function (Blueprint $table) {
      $table->index('role_id');
  });
  Schema::table('students', function (Blueprint $table) {
      $table->index('user_id');
      $table->index('status');
  });
  Schema::table('applications', function (Blueprint $table) {
      $table->index(['status', 'created_at']);
      $table->index('user_id');
      $table->index('project_id');
  });
  Schema::table('taxonomies', function (Blueprint $table) {
      $table->index('type');
      $table->index('parent_id');
  });
  ```

---

## High Priority (Should Fix)

### 4. Error Handling

- [ ] **Create Error Boundary component**
  ```jsx
  // resources/js/Components/ErrorBoundary.jsx
  import React from 'react'
  import { Result, Button } from 'antd'

  class ErrorBoundary extends React.Component {
    state = { hasError: false }

    static getDerivedStateFromError() {
      return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
      // Log to error reporting service
      console.error('React Error:', error, errorInfo)
    }

    render() {
      if (this.state.hasError) {
        return (
          <Result
            status="error"
            title="Something went wrong"
            subTitle="Please refresh the page or contact support."
            extra={<Button onClick={() => window.location.reload()}>Refresh</Button>}
          />
        )
      }
      return this.props.children
    }
  }
  export default ErrorBoundary
  ```

- [ ] **Create custom error pages**
  ```bash
  # Create these files:
  resources/views/errors/404.blade.php
  resources/views/errors/500.blade.php
  resources/views/errors/503.blade.php
  ```

### 5. Performance

- [ ] **Enable Laravel caching**
  ```bash
  php artisan config:cache
  php artisan route:cache
  php artisan view:cache
  php artisan event:cache
  ```

- [ ] **Optimize Composer autoload**
  ```bash
  composer install --optimize-autoloader --no-dev
  ```

- [ ] **Build frontend for production**
  ```bash
  yarn build
  ```

---

## Medium Priority (Recommended)

### 6. Security Hardening

- [ ] **Add rate limiting to routes**
  ```php
  // routes/inertia.php - Add to login/register
  Route::middleware(['throttle:5,1'])->group(function () {
      // Auth routes
  });
  ```

- [ ] **Enable HTTPS only**
  ```php
  // app/Providers/AppServiceProvider.php
  public function boot() {
      if (config('app.env') === 'production') {
          URL::forceScheme('https');
      }
  }
  ```

- [ ] **Add CSP headers**
  ```php
  // app/Http/Middleware/SecurityHeaders.php
  $response->headers->set('X-Content-Type-Options', 'nosniff');
  $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
  $response->headers->set('X-XSS-Protection', '1; mode=block');
  ```

### 7. Monitoring & Logging

- [ ] **Set up error logging**
  ```bash
  # Consider: Sentry, Bugsnag, or Laravel Telescope
  composer require sentry/sentry-laravel
  ```

- [ ] **Configure log rotation**
  ```php
  // config/logging.php
  'daily' => [
      'driver' => 'daily',
      'path' => storage_path('logs/laravel.log'),
      'days' => 14,
  ],
  ```

### 8. Backup Strategy

- [ ] **Set up database backups**
  ```bash
  composer require spatie/laravel-backup
  php artisan vendor:publish --provider="Spatie\Backup\BackupServiceProvider"
  ```

---

## Pre-Deployment Commands

```bash
# 1. Pull latest code
git pull origin main

# 2. Install dependencies
composer install --optimize-autoloader --no-dev
yarn install --production

# 3. Run migrations
php artisan migrate --force

# 4. Build frontend
yarn build

# 5. Clear and cache
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 6. Set permissions
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# 7. Restart queue workers (if using)
php artisan queue:restart
```

---

## Post-Deployment Verification

- [ ] Test login/logout
- [ ] Test student registration flow
- [ ] Test application submission
- [ ] Test admin CRUD operations
- [ ] Test file uploads (photos, documents, challans)
- [ ] Test print forms/challans
- [ ] Verify SSL certificate
- [ ] Check error logging works
- [ ] Test email sending
- [ ] Test SMS sending

---

## Recommended Hosting Requirements

- **PHP**: 8.1+
- **MySQL**: 8.0+
- **RAM**: 2GB minimum
- **Storage**: 20GB+ for uploads
- **SSL**: Required
- **Queue Worker**: Supervisor for background jobs
