<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\Notify;
use App\Helpers\Response;
use App\Http\Controllers\Controller;
use App\Http\Resources\RegisteredUserResource;
use App\Models\User;
use App\Traits\HasListing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class RegisteredUserController extends Controller
{
    use HasListing;

    /**
     * JSON listing for DataGridTable (AG Grid)
     * Returns users with student role who haven't been admitted yet
     */
    public function listing(Request $request): JsonResponse
    {
        try {
            $result = $this->getListing(
                $request,
                User::class,
                ['student'],
                RegisteredUserResource::class,
                [
                    'preFilter' => function ($query, $request) {
                        // Filter to only show users with student role (role_id = 2)
                        $query->where('role_id', User::ROLE_STUDENT);

                        // Only show users who don't have an active student record
                        $query->whereDoesntHave('student', function($q) {
                            $q->where('status', 'Active');
                        });
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

    /**
     * Display the registered users listing page
     */
    public function index(Request $request): InertiaResponse
    {
        return Inertia::render('Admin/RegisteredUsers/Index');
    }

    /**
     * Show a specific registered user
     */
    public function show(Request $request, User $user)
    {
        $user->load(['role', 'student.district', 'student.province', 'student.gender', 'education.degree', 'applications.project']);

        if ($request->wantsJson()) {
            return Response::success([
                'user' => new RegisteredUserResource($user),
            ]);
        }

        return Inertia::render('Admin/RegisteredUsers/Show', [
            'user' => new RegisteredUserResource($user),
        ]);
    }

    /**
     * Update the registered user's status
     */
    public function updateStatus(Request $request, User $user)
    {
        $validated = $request->validate([
            'status' => 'required|in:Pending,Approved,Rejected',
        ]);

        // Update student status if exists
        if ($user->student) {
            $user->student->update(['status' => $validated['status']]);
        }

        Notify::success('User status updated successfully.');

        if ($request->wantsJson()) {
            return Response::success([
                'user' => new RegisteredUserResource($user->load('student')),
            ]);
        }

        return redirect()->back()->with('success', 'User status updated successfully.');
    }

    /**
     * Delete a registered user
     */
    public function destroy(Request $request, User $user)
    {
        $user->delete();

        Notify::success('User deleted successfully.');

        if ($request->wantsJson()) {
            return Response::success();
        }

        return redirect()->route('admin.registered-users.index')
            ->with('success', 'User deleted successfully.');
    }
}
