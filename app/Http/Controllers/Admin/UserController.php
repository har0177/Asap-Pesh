<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $query = User::with('role');

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Filter by role
        if ($request->has('role_id') && $request->role_id) {
            $query->where('role_id', $request->role_id);
        }

        // Filter by status
        if ($request->has('status')) {
            if ($request->status === 'verified') {
                $query->whereNotNull('email_verified_at');
            } elseif ($request->status === 'unverified') {
                $query->whereNull('email_verified_at');
            }
        }

        $users = $query->latest()
            ->paginate($request->per_page ?? 15)
            ->through(function ($user) {
                return [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'full_name' => $user->full_name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'avatar' => $user->avatar,
                    'role' => $user->role ? [
                        'id' => $user->role->id,
                        'name' => $user->role->name,
                    ] : null,
                    'email_verified_at' => $user->email_verified_at?->format('Y-m-d H:i'),
                    'created_at' => $user->created_at?->format('Y-m-d'),
                ];
            });

        $roles = Role::all()->map(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
            ];
        });

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'roles' => $roles,
            'filters' => $request->only(['search', 'role_id', 'status', 'per_page']),
        ]);
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

        User::create($validated);

        return redirect()->route('admin.users.index')
            ->with('success', 'User created successfully.');
    }

    public function show(User $user): Response
    {
        $user->load(['role', 'student', 'applications.project']);

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

        return redirect()->route('admin.users.index')
            ->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'User deleted successfully.');
    }
}
