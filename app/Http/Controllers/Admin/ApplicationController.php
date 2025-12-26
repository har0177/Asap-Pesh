<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\Notify;
use App\Helpers\Response;
use App\Http\Controllers\Controller;
use App\Http\Resources\ApplicationResource;
use App\Models\Application;
use App\Traits\HasListing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class ApplicationController extends Controller
{
    use HasListing;

    /**
     * JSON listing for DataGridTable (AG Grid)
     */
    public function listing(Request $request): JsonResponse
    {
        try {
            $result = $this->getListing(
                $request,
                Application::class,
                ['user', 'project.diploma'],
                ApplicationResource::class
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
        return Inertia::render('Admin/Applications/Listing');
    }

    public function show(Request $request, Application $application)
    {
        $application->load([
            'user.student.diploma',
            'user.student.district',
            'user.education',
            'project.diploma',
        ]);

        if ($request->wantsJson()) {
            return Response::success([
                'application' => new ApplicationResource($application),
            ]);
        }

        return Inertia::render('Admin/Applications/Show', [
            'application' => new ApplicationResource($application),
        ]);
    }

    public function updateStatus(Request $request, Application $application)
    {
        $validated = $request->validate([
            'status' => 'required|in:Pending,Paid,Rejected,Approved',
            'remarks' => 'nullable|string|max:500',
        ]);

        $application->update($validated);

        Notify::success('Application status updated successfully.');

        if ($request->wantsJson()) {
            return Response::success([
                'application' => new ApplicationResource($application->load(['user', 'project'])),
            ]);
        }

        return redirect()->back()
            ->with('success', 'Application status updated successfully.');
    }

    public function destroy(Request $request, Application $application)
    {
        $application->delete();

        Notify::success('Application deleted successfully.');

        if ($request->wantsJson()) {
            return Response::success();
        }

        return redirect()->route('admin.applications.index')
            ->with('success', 'Application deleted successfully.');
    }

    public function restore(Request $request, int $id)
    {
        $application = Application::withTrashed()->findOrFail($id);
        $application->restore();

        Notify::success('Application restored successfully.');

        if ($request->wantsJson()) {
            return Response::success([
                'application' => new ApplicationResource($application->load(['user', 'project'])),
            ]);
        }

        return redirect()->route('admin.applications.index')
            ->with('success', 'Application restored successfully.');
    }

    public function export(Request $request)
    {
        // Export will be handled by HasListing trait when export=true is passed
        return redirect()->back()
            ->with('info', 'Export functionality will be implemented.');
    }
}
