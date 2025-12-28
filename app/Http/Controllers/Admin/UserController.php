<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\Notify;
use App\Helpers\Response;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Role;
use App\Models\User;
use App\Traits\HasListing;
use App\Traits\HandlesApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class UserController extends Controller
{
    use HasListing, HandlesApiResponse;

    /**
     * JSON listing for DataGridTable (AG Grid)
     */
    public function listing(Request $request): JsonResponse
    {
        try {
            $result = $this->getListing(
                $request,
                User::class,
                ['role:id,name'],
                UserResource::class,
                [
                    'preFilter' => function ($query, $request) {
                        // Add any pre-filter logic here (e.g., permission checks)
                    },
                ]
            );

            // Check if this is an export request
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
        return Inertia::render('Admin/Users/Listing');
    }

    public function create(): InertiaResponse
    {
        $roles = Role::all()->map(fn ($role) => [
            'id' => $role->id,
            'name' => $role->name,
        ]);

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

        Notify::success('User created successfully.');

        return $this->respondCreated(
            ['user' => new UserResource($user->load('role'))],
            'User created successfully.',
            'admin.users.index'
        );
    }

    public function show(Request $request, User $user)
    {
        $user->load(['role', 'student', 'applications.project']);

        if ($request->wantsJson()) {
            return Response::success([
                'user' => new UserResource($user),
            ]);
        }

        return Inertia::render('Admin/Users/Show', [
            'user' => new UserResource($user),
        ]);
    }

    public function edit(User $user): InertiaResponse
    {
        $roles = Role::all()->map(fn ($role) => [
            'id' => $role->id,
            'name' => $role->name,
        ]);

        return Inertia::render('Admin/Users/Edit', [
            'user' => new UserResource($user->load('role')),
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

        Notify::success('User updated successfully.');

        return $this->respondSuccess(
            ['user' => new UserResource($user->load('role'))],
            'User updated successfully.',
            'admin.users.index'
        );
    }

    public function destroy(Request $request, User $user)
    {
        $user->delete();

        Notify::success('User deleted successfully.');

        return $this->respondDeleted('User deleted successfully.', 'admin.users.index');
    }

    public function restore(Request $request, int $id)
    {
        $user = User::withTrashed()->findOrFail($id);
        $user->restore();

        Notify::success('User restored successfully.');

        return $this->respondRestored(
            ['user' => new UserResource($user->load('role'))],
            'User restored successfully.',
            'admin.users.index'
        );
    }
}
