<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\Notify;
use App\Helpers\Response;
use App\Http\Controllers\Controller;
use App\Http\Resources\RoleResource;
use App\Models\Role;
use App\Traits\HasListing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class RoleController extends Controller
{
    use HasListing;

    // Available permissions in the system
    protected array $availablePermissions = [
        'users' => ['manage users', 'add user', 'edit user', 'view user', 'delete user'],
        'students' => ['manage students', 'add student', 'edit student', 'view student', 'delete student'],
        'applications' => ['manage applications', 'edit application', 'view application'],
        'projects' => ['manage projects', 'add project', 'edit project', 'view project', 'delete project'],
        'roles' => ['manage roles', 'add role', 'edit role', 'view role', 'delete role'],
        'employees' => ['manage employees', 'add employee', 'edit employee', 'view employee', 'delete employee'],
        'cms' => ['manage cms', 'manage slides', 'manage gallery', 'manage events', 'manage content'],
        'settings' => ['manage settings'],
    ];

    /**
     * JSON listing for DataGridTable (AG Grid)
     */
    public function listing(Request $request): JsonResponse
    {
        try {
            $result = $this->getListing(
                $request,
                Role::class,
                [],
                RoleResource::class,
                [
                    'withCount' => ['users'],
                ]
            );

            if ($request->boolean('export')) {
                return $result;
            }

            return response()->json($result);
        } catch (\Throwable $e) {
            return Response::error($e->getMessage(), 500);
        }
    }

    public function index(Request $request): InertiaResponse
    {
        return Inertia::render('Admin/Roles/Listing', [
            'availablePermissions' => $this->availablePermissions,
        ]);
    }

    public function create(): InertiaResponse
    {
        return Inertia::render('Admin/Roles/Create', [
            'availablePermissions' => $this->availablePermissions,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'description' => 'nullable|string|max:500',
            'permissions' => 'nullable|array',
        ]);

        $role = Role::create($validated);

        Notify::success('Role created successfully.');

        if ($request->wantsJson()) {
            return Response::success([
                'role' => new RoleResource($role),
            ]);
        }

        return redirect()->route('admin.roles.index')
            ->with('success', 'Role created successfully.');
    }

    public function show(Request $request, Role $role)
    {
        $role->loadCount('users');

        if ($request->wantsJson()) {
            return Response::success([
                'role' => new RoleResource($role),
                'availablePermissions' => $this->availablePermissions,
            ]);
        }

        return Inertia::render('Admin/Roles/Show', [
            'role' => new RoleResource($role),
            'availablePermissions' => $this->availablePermissions,
        ]);
    }

    public function edit(Role $role): InertiaResponse
    {
        return Inertia::render('Admin/Roles/Edit', [
            'role' => new RoleResource($role),
            'availablePermissions' => $this->availablePermissions,
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'description' => 'nullable|string|max:500',
            'permissions' => 'nullable|array',
        ]);

        $role->update($validated);

        Notify::success('Role updated successfully.');

        if ($request->wantsJson()) {
            return Response::success([
                'role' => new RoleResource($role),
            ]);
        }

        return redirect()->route('admin.roles.index')
            ->with('success', 'Role updated successfully.');
    }

    public function destroy(Request $request, Role $role)
    {
        // Prevent deleting role with users
        if ($role->users()->count() > 0) {
            Notify::error('Cannot delete role with existing users.');

            if ($request->wantsJson()) {
                return Response::error('Cannot delete role with existing users.', 422);
            }

            return redirect()->back()
                ->with('error', 'Cannot delete role with existing users.');
        }

        $role->delete();

        Notify::success('Role deleted successfully.');

        if ($request->wantsJson()) {
            return Response::success();
        }

        return redirect()->route('admin.roles.index')
            ->with('success', 'Role deleted successfully.');
    }
}
