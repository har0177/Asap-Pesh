<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;

class PrintController extends Controller
{
    /**
     * Print Fee Challan (Bank Deposit Slip)
     * Shows 3 copies: Bank Copy, Account Copy, Student Copy
     */
    public function challan(Application $application)
    {
        $application->load(['user.student', 'project.diploma']);

        return view('print-challan', [
            'application' => $application,
        ]);
    }

    /**
     * Print Admission Form
     */
    public function form(Application $application)
    {
        $application->load([
            'user.student.district',
            'user.student.province',
            'user.student.gender',
            'user.student.bloodGroup',
            'user.education.degree',
            'project.diploma'
        ]);

        return view('print-form', [
            'application' => $application,
            'user' => $application->user,
        ]);
    }

    /**
     * Student ID Card - single or bulk
     */
    public function studentCard(Request $request)
    {
        $studentIds = $request->input('id');

        if (is_array($studentIds)) {
            $students = User::whereHas('student')
                ->with(['student.diploma', 'student.section', 'student.bloodGroup'])
                ->whereIn('id', $studentIds)
                ->get();
        } else {
            $students = User::whereHas('student')
                ->with(['student.diploma', 'student.section', 'student.bloodGroup'])
                ->where('id', $studentIds)
                ->get();
        }

        return view('student-card', [
            'students' => $students,
        ]);
    }

    /**
     * Attendance Sheet
     */
    public function attendance(Request $request)
    {
        $diplomaId = $request->input('diploma_id');
        $sectionId = $request->input('section_id');

        $query = User::whereHas('student', function($q) {
            $q->where('status', 'Active');
        })->with(['student.diploma', 'student.section']);

        if ($diplomaId) {
            $query->whereHas('student', function($q) use ($diplomaId) {
                $q->where('diploma_id', $diplomaId);
            });
        }

        if ($sectionId) {
            $query->whereHas('student', function($q) use ($sectionId) {
                $q->where('section_id', $sectionId);
            });
        }

        $students = $query->get();

        return view('attendance', [
            'students' => $students,
        ]);
    }
}
