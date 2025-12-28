<?php

namespace App\Traits;

use App\Helpers\Response;

/**
 * Trait for handling consistent API responses across controllers
 * Reduces code duplication by centralizing response logic
 */
trait HandlesApiResponse
{
    /**
     * Return a success response
     *
     * @param mixed $data Data to return
     * @param string $message Success message
     * @param string|null $redirectRoute Route to redirect to (for non-JSON requests)
     * @param int $status HTTP status code
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    protected function respondSuccess($data = null, string $message = 'Success', ?string $redirectRoute = null, int $status = 200)
    {
        if (request()->wantsJson() || request()->ajax()) {
            return Response::success($data, $message, $status);
        }

        $redirect = $redirectRoute ? redirect()->route($redirectRoute) : back();
        return $redirect->with('success', $message);
    }

    /**
     * Return an error response
     *
     * @param string $message Error message
     * @param int $status HTTP status code
     * @param mixed $errors Additional error details
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    protected function respondError(string $message, int $status = 422, $errors = null)
    {
        if (request()->wantsJson() || request()->ajax()) {
            return Response::error($message, $status, $errors);
        }

        return back()->withErrors(['error' => $message])->withInput();
    }

    /**
     * Return a validation error response
     *
     * @param array $errors Validation errors
     * @param string $message Error message
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    protected function respondValidationError(array $errors, string $message = 'Validation failed')
    {
        if (request()->wantsJson() || request()->ajax()) {
            return response()->json([
                'success' => false,
                'message' => $message,
                'errors' => $errors,
            ], 422);
        }

        return back()->withErrors($errors)->withInput();
    }

    /**
     * Return a not found response
     *
     * @param string $message Not found message
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    protected function respondNotFound(string $message = 'Resource not found')
    {
        if (request()->wantsJson() || request()->ajax()) {
            return Response::error($message, 404);
        }

        abort(404, $message);
    }

    /**
     * Return an unauthorized response
     *
     * @param string $message Unauthorized message
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    protected function respondUnauthorized(string $message = 'Unauthorized')
    {
        if (request()->wantsJson() || request()->ajax()) {
            return Response::error($message, 403);
        }

        abort(403, $message);
    }

    /**
     * Return a created response (for POST requests creating new resources)
     *
     * @param mixed $data Created resource data
     * @param string $message Success message
     * @param string|null $redirectRoute Route to redirect to
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    protected function respondCreated($data = null, string $message = 'Created successfully', ?string $redirectRoute = null)
    {
        return $this->respondSuccess($data, $message, $redirectRoute, 201);
    }

    /**
     * Return a deleted response
     *
     * @param string $message Success message
     * @param string|null $redirectRoute Route to redirect to
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    protected function respondDeleted(string $message = 'Deleted successfully', ?string $redirectRoute = null)
    {
        return $this->respondSuccess(null, $message, $redirectRoute);
    }

    /**
     * Return a restored response (for soft-deleted resources)
     *
     * @param mixed $data Restored resource data
     * @param string $message Success message
     * @param string|null $redirectRoute Route to redirect to
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    protected function respondRestored($data = null, string $message = 'Restored successfully', ?string $redirectRoute = null)
    {
        return $this->respondSuccess($data, $message, $redirectRoute);
    }
}
