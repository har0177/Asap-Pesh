<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\Notify;
use App\Helpers\Response;
use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Student;
use App\Services\SmsService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class SmsController extends Controller
{
    /**
     * Display SMS page
     */
    public function index(Request $request): InertiaResponse
    {
        $balance = null;

        try {
            $sms = new SmsService();
            $response = $sms->checkRemainingSMS();
            $balance = $response->body();
        } catch (\Exception $e) {
            $balance = 'Unable to check balance';
        }

        // Get recipient counts
        $counts = [
            'students' => Student::where('status', 'Active')->count(),
            'employees' => Employee::where('status', 1)->count(),
            'parents' => Student::where('status', 'Active')
                ->whereNotNull('father_contact')
                ->where('father_contact', '!=', '')
                ->count(),
        ];

        return Inertia::render('Admin/SMS/Index', [
            'balance' => $balance,
            'counts' => $counts,
        ]);
    }

    /**
     * Send SMS to recipients
     */
    public function send(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:students,employees,parents',
            'message' => 'required|string|max:500',
        ]);

        $recipients = [];

        if ($validated['type'] === 'students') {
            $recipients = Student::query()
                ->where('status', 'Active')
                ->get()
                ->pluck('user.phone')
                ->toArray();
        } elseif ($validated['type'] === 'employees') {
            $recipients = Employee::query()
                ->where('status', 1)
                ->pluck('contact_number')
                ->toArray();
        } elseif ($validated['type'] === 'parents') {
            $recipients = Student::query()
                ->where('status', 'Active')
                ->whereNotNull('father_contact')
                ->where('father_contact', '!=', '')
                ->pluck('father_contact')
                ->toArray();
        }

        // Clean phone numbers
        $cleanedRecipients = collect($recipients)
            ->map(fn($value) => trim($value))
            ->filter(fn($value) => is_numeric($value) && $value !== '')
            ->map(fn($value) => str_replace('"', '', $value))
            ->map(function ($value) {
                $phone = ltrim($value, '0');
                if (substr($phone, 0, 2) !== '92') {
                    $phone = '92' . $phone;
                }
                return str_replace('-', '', $phone);
            })
            ->unique()
            ->values()
            ->toArray();

        if (empty($cleanedRecipients)) {
            Notify::error('No valid phone numbers found for the selected recipients.');

            if ($request->wantsJson()) {
                return Response::error('No valid phone numbers found.', 400);
            }

            return redirect()->back()->withErrors(['error' => 'No valid phone numbers found.']);
        }

        try {
            $sms = new SmsService();
            $phoneList = implode(',', $cleanedRecipients);
            $result = $sms->sendToAll($phoneList, $validated['message']);

            Notify::success('SMS sent successfully to ' . count($cleanedRecipients) . ' recipients.');

            if ($request->wantsJson()) {
                return Response::success([
                    'message' => 'SMS sent successfully',
                    'recipients_count' => count($cleanedRecipients),
                    'result' => $result,
                ]);
            }

            return redirect()->back()->with('success', 'SMS sent successfully to ' . count($cleanedRecipients) . ' recipients.');

        } catch (\Exception $e) {
            Notify::error('Failed to send SMS: ' . $e->getMessage());

            if ($request->wantsJson()) {
                return Response::error('Failed to send SMS: ' . $e->getMessage(), 500);
            }

            return redirect()->back()->withErrors(['error' => 'Failed to send SMS: ' . $e->getMessage()]);
        }
    }

    /**
     * Check SMS balance
     */
    public function balance(Request $request)
    {
        try {
            $sms = new SmsService();
            $response = $sms->checkRemainingSMS();

            return response()->json([
                'success' => true,
                'balance' => $response->body(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Unable to check balance',
            ], 500);
        }
    }

    /**
     * Get recipient count by type
     */
    public function recipientCount(Request $request)
    {
        $type = $request->input('type');
        $count = 0;

        if ($type === 'students') {
            $count = Student::where('status', 'Active')
                ->whereHas('user', function ($q) {
                    $q->whereNotNull('phone')->where('phone', '!=', '');
                })
                ->count();
        } elseif ($type === 'employees') {
            $count = Employee::where('status', 1)
                ->whereNotNull('contact_number')
                ->where('contact_number', '!=', '')
                ->count();
        } elseif ($type === 'parents') {
            $count = Student::where('status', 'Active')
                ->whereNotNull('father_contact')
                ->where('father_contact', '!=', '')
                ->count();
        }

        return response()->json([
            'success' => true,
            'count' => $count,
        ]);
    }
}
