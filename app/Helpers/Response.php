<?php

namespace App\Helpers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Response as LaravelResponse;

class Response
{
    /**
     * Return a success JSON response
     *
     * @param array $data
     * @param string $message
     * @param int $status
     * @return JsonResponse
     */
    public static function success(array $data = [], string $message = 'Success', int $status = 200): JsonResponse
    {
        return LaravelResponse::json([
            'success' => true,
            'message' => $message,
            'data' => $data,
            'notifications' => Notify::messages(),
        ], $status);
    }

    /**
     * Return an error JSON response
     *
     * @param string $message
     * @param int $status
     * @param array $data
     * @return JsonResponse
     */
    public static function error(string $message = 'Error', int $status = 400, array $data = []): JsonResponse
    {
        return LaravelResponse::json([
            'success' => false,
            'message' => $message,
            'data' => $data,
            'notifications' => Notify::messages(),
        ], $status);
    }

    /**
     * Return a validation error response
     *
     * @param array $errors
     * @param string $message
     * @return JsonResponse
     */
    public static function validationError(array $errors, string $message = 'Validation failed'): JsonResponse
    {
        return LaravelResponse::json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
            'notifications' => Notify::messages(),
        ], 422);
    }

    /**
     * Return a not found response
     *
     * @param string $message
     * @return JsonResponse
     */
    public static function notFound(string $message = 'Resource not found'): JsonResponse
    {
        return self::error($message, 404);
    }

    /**
     * Return an unauthorized response
     *
     * @param string $message
     * @return JsonResponse
     */
    public static function unauthorized(string $message = 'Unauthorized'): JsonResponse
    {
        return self::error($message, 401);
    }

    /**
     * Return a forbidden response
     *
     * @param string $message
     * @return JsonResponse
     */
    public static function forbidden(string $message = 'Forbidden'): JsonResponse
    {
        return self::error($message, 403);
    }
}
