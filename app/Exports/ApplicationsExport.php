<?php

namespace App\Exports;

use App\Models\Application;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ApplicationsExport implements FromCollection, WithHeadings
{
    public $filters;

    public function __construct($filters = [])
    {
        $this->filters = $filters;
    }

    public function collection()
    {
        $query = Application::query()
            ->when($this->filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery->where('application_number', 'LIKE', "%{$search}%");
                })->orWhereHas('user', function ($q) use ($search) {
                    $q->whereRaw("CONCAT(first_name, ' ',last_name) LIKE ?", ["%{$search}%"]);
                });
            })
            ->when($this->filters['paid'] ?? null, fn($q) => $q->where('status', 'Paid'))
            ->when($this->filters['quota_search'] ?? null, fn($q, $quota) => $q->whereJsonContains('quota', $quota))
            ->when($this->filters['diploma_search'] ?? null, fn($q, $diploma) => $q->whereHas('project', fn($p) => $p->where('diploma_id', $diploma)))
            ->whereYear('created_at', Carbon::now()->year)
            ->with(['user', 'project.diploma'])
            ->orderBy('id', 'desc');

        return $query->get()->map(function ($app) {
            return [
                'Application #' => $app->application_number,
                'Full Name' => $app->user->full_name,
                'Father Name' => $app->user->student->father_name,
                'Diploma' => $app->project->diploma->name ?? '',
                'Quota' => implode(', ', $app->quotaName ?? []),
                'District' => $app->user->student->district->name,
                'Created At' => $app->created_at->format('Y-m-d'),
            ];
        });
    }

    public function headings(): array
    {
        return [
            'Application #',
            'Full Name',
            'Father Name',
            'Diploma',
            'Quota',
            'District',
            'Created At',
        ];
    }
}
