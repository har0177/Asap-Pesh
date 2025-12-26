<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RoleController extends Controller
{
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
        $query = Role::withCount('users');

        // Handle search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Handle sorting
        $sortModel = $request->input('sort', []);
        if (!empty($sortModel)) {
            foreach ($sortModel as $sort) {
                $colId = $sort['colId'] ?? null;
                $sortDirection = $sort['sort'] ?? 'asc';
                if ($colId) {
                    $query->orderBy($colId, $sortDirection);
                }
            }
        } else {
            $query->latest();
        }

        $pageSize = $request->input('pageSize', 20);
        $currentPage = $request->input('current', 1);

        $roles = $query->paginate($pageSize, ['*'], 'page', $currentPage);

        $data = $roles->getCollection()->map(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
                'slug' => $role->slug,
                'description' => $role->description,
                'permissions' => $role->permissions ?? [],
                'permissions_count' => is_array($role->permissions) ? count($role->permissions) : 0,
                'users_count' => $role->users_count ?? 0,
                'created_at' => $role->created_at?->format('Y-m-d'),
                'updated_at' => $role->updated_at?->format('Y-m-d'),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data,
            'total' => $roles->total(),
            'pagination' => [
                'current_page' => $roles->currentPage(),
                'last_page' => $roles->lastPage(),
                'per_page' => $roles->perPage(),
                'total' => $roles->total(),
            ],
        ]);
    }

    public function index(Request $request): Response
    {
        return Inertia::render('Admin/Roles/Listing', [
            'availablePermissions' => $this->availablePermissions,
        ]);
    }

    public function create(): Response
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

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Role created successfully.',
                'role' => $role,
            ]);
        }

        return redirect()->route('v2.admin.roles.index')
            ->with('success', 'Role created successfully.');
    }

    public function show(Role $role)
    {
        $role->loadCount('users');

        return Inertia::render('Admin/Roles/Show', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'slug' => $role->slug,
                'description' => $role->description,
                'permissions' => $role->permissions ?? [],
                'users_count' => $role->users_count,
                'created_at' => $role->created_at?->format('Y-m-d H:i'),
            ],
            'availablePermissions' => $this->availablePermissions,
        ]);
    }

    public function edit(Role $role): Response
    {
        return Inertia::render('Admin/Roles/Edit', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'description' => $role->description,
                'permissions' => $role->permissions ?? [],
            ],
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

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Role updated successfully.',
                'role' => $role,
            ]);
        }

        return redirect()->route('v2.admin.roles.index')
            ->with('success', 'Role updated successfully.');
    }

    public function destroy(Request $request, Role $role)
    {
        // Prevent deleting role with users
        if ($role->users()->count() > 0) {
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete role with existing users.',
                ], 422);
            }

            return redirect()->back()
                ->with('error', 'Cannot delete role with existing users.');
        }

        $role->delete();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Role deleted successfully.',
            ]);
        }

        return redirect()->route('v2.admin.roles.index')
            ->with('success', 'Role deleted successfully.');
    }
}
