<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * JSON listing for DataGridTable (AG Grid)
     */
    public function listing(Request $request): JsonResponse
    {
        $searchableFields = ['first_name', 'last_name', 'email', 'phone', 'cnic'];
        $filterableFields = ['role_id', 'email_verified_at', 'created_at'];

        $query = User::with('role');

        // Handle soft deleted
        if ($request->boolean('soft_deleted')) {
            $query->onlyTrashed();
        }

        // Handle search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                foreach ($searchableFields as $field) {
                    $q->orWhere($field, 'like', "%{$search}%");
                }
            });
        }

        // Handle filterTree from GlobalFilter
        if ($request->filled('filterTree')) {
            $filterTree = $request->filterTree;
            if (!empty($filterTree['conditions'])) {
                $this->applyFilterTree($query, $filterTree);
            }
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

        $users = $query->paginate($pageSize, ['*'], 'page', $currentPage);

        return response()->json([
            'success' => true,
            'data' => UserResource::collection($users->items()),
            'total' => $users->total(),
            'pagination' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ],
        ]);
    }

    /**
     * Apply filter tree from GlobalFilter component
     */
    protected function applyFilterTree($query, array $filterTree): void
    {
        $type = $filterTree['type'] ?? 'AND';
        $conditions = $filterTree['conditions'] ?? [];
        $method = strtolower($type) === 'or' ? 'orWhere' : 'where';

        $query->where(function ($q) use ($conditions, $method) {
            foreach ($conditions as $condition) {
                if (isset($condition['conditions'])) {
                    // Nested group
                    $this->applyFilterTree($q, $condition);
                } else {
                    // Single condition
                    $field = $condition['field'] ?? null;
                    $operator = $condition['operator'] ?? 'is';
                    $value = $condition['value'] ?? null;

                    if ($field && $value !== null) {
                        $this->applyCondition($q, $field, $operator, $value, $method);
                    }
                }
            }
        });
    }

    /**
     * Apply a single filter condition
     */
    protected function applyCondition($query, string $field, string $operator, $value, string $method = 'where'): void
    {
        switch ($operator) {
            case 'is':
                if (is_array($value)) {
                    $query->{$method . 'In'}($field, $value);
                } else {
                    $query->$method($field, '=', $value);
                }
                break;
            case 'is not':
                if (is_array($value)) {
                    $query->{$method . 'NotIn'}($field, $value);
                } else {
                    $query->$method($field, '!=', $value);
                }
                break;
            case 'contains':
                $query->$method($field, 'like', "%{$value}%");
                break;
            case 'starts with':
                $query->$method($field, 'like', "{$value}%");
                break;
            case 'ends with':
                $query->$method($field, 'like', "%{$value}");
                break;
            case 'is null':
                $query->{$method . 'Null'}($field);
                break;
            case 'is not null':
                $query->{$method . 'NotNull'}($field);
                break;
            case 'greater than':
            case 'after':
                $query->$method($field, '>', $value);
                break;
            case 'less than':
            case 'before':
                $query->$method($field, '<', $value);
                break;
            case 'between':
                if (is_array($value) && count($value) === 2) {
                    $query->whereBetween($field, $value);
                }
                break;
            default:
                $query->$method($field, '=', $value);
        }
    }

    public function index(Request $request): Response
    {
        // Render the new AG Grid listing page
        return Inertia::render('Admin/Users/Listing');
    }

    public function create(): Response
    {
        $roles = Role::all()->map(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
            ];
        });

        return Inertia::render('Admin/Users/Create', [
            'roles' => $roles,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'password' => ['required', 'confirmed', Password::defaults()],
            'role_id' => 'required|exists:roles,id',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'User created successfully.',
                'user' => new UserResource($user->load('role')),
            ]);
        }

        return redirect()->route('v2.admin.users.index')
            ->with('success', 'User created successfully.');
    }

    public function show(Request $request, User $user)
    {
        $user->load(['role', 'student', 'applications.project']);

        // Return JSON for AJAX requests (modal form data)
        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'user' => new UserResource($user),
            ]);
        }

        return Inertia::render('Admin/Users/Show', [
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'full_name' => $user->full_name,
                'email' => $user->email,
                'phone' => $user->phone,
                'cnic' => $user->cnic,
                'avatar' => $user->avatar,
                'role' => $user->role ? [
                    'id' => $user->role->id,
                    'name' => $user->role->name,
                ] : null,
                'student' => $user->student,
                'applications' => $user->applications->map(function ($app) {
                    return [
                        'id' => $app->id,
                        'project' => $app->project?->name,
                        'status' => $app->status,
                        'created_at' => $app->created_at?->format('Y-m-d'),
                    ];
                }),
                'email_verified_at' => $user->email_verified_at?->format('Y-m-d H:i'),
                'created_at' => $user->created_at?->format('Y-m-d H:i'),
            ],
        ]);
    }

    public function edit(User $user): Response
    {
        $roles = Role::all()->map(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
            ];
        });

        return Inertia::render('Admin/Users/Edit', [
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role_id' => $user->role_id,
            ],
            'roles' => $roles,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'password' => ['nullable', 'confirmed', Password::defaults()],
            'role_id' => 'required|exists:roles,id',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'User updated successfully.',
                'user' => new UserResource($user->load('role')),
            ]);
        }

        return redirect()->route('v2.admin.users.index')
            ->with('success', 'User updated successfully.');
    }

    public function destroy(Request $request, User $user)
    {
        $user->delete();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully.',
            ]);
        }

        return redirect()->route('v2.admin.users.index')
            ->with('success', 'User deleted successfully.');
    }

    public function restore(Request $request, int $id)
    {
        $user = User::withTrashed()->findOrFail($id);
        $user->restore();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'User restored successfully.',
            ]);
        }

        return redirect()->route('v2.admin.users.index')
            ->with('success', 'User restored successfully.');
    }
}
