<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Session;

class Notify
{
    private const KEY = '_notify_messages';

    /**
     * Add a success notification
     */
    public static function success(string $message): void
    {
        self::add('success', $message);
    }

    /**
     * Add an error notification
     */
    public static function error(string $message): void
    {
        self::add('error', $message);
    }

    /**
     * Add an alert/warning notification
     */
    public static function alert(string $message): void
    {
        self::add('warning', $message);
    }

    /**
     * Add an info notification
     */
    public static function info(string $message): void
    {
        self::add('info', $message);
    }

    /**
     * Add a notification message
     */
    public static function add(string $type, string $message): void
    {
        $messages = Session::get(self::KEY, []);
        $messages[] = ['type' => $type, 'message' => $message];
        Session::put(self::KEY, $messages);
    }

    /**
     * Get all notification messages and clear them
     */
    public static function messages(): ?array
    {
        $messages = Session::get(self::KEY);
        Session::forget(self::KEY);

        return $messages;
    }

    /**
     * Check if there are any messages
     */
    public static function hasMessages(): bool
    {
        return !empty(Session::get(self::KEY));
    }
}
