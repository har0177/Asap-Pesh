<?php

namespace App\Traits;

use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

trait HasListing
{
    /**
     * Get listing data with pagination, filtering, and optional export
     *
     * @param Request $request
     * @param string $model Model class name
     * @param array $with Relationships to eager load
     * @param string|null $resource Resource class for transformation
     * @param array $options Additional options (preFilter, postFilter, withCount)
     * @return array|BinaryFileResponse
     */
    protected function getListing(Request $request, $model, $with = [], $resource = null, $options = [])
    {
        $query = $model::query();

        // Apply with relationships
        if (!empty($with)) {
            $query->with($with);
        }

        // Apply taxonomy filter if provided
        $taxonomy = $request->taxonomy ?? null;
        $query->when($taxonomy, fn ($q) => $q->where('type', $taxonomy));

        // Apply pre-filter conditions (before filters)
        if (isset($options['preFilter']) && is_callable($options['preFilter'])) {
            $options['preFilter']($query, $request);
        }

        // Apply withCount AFTER preFilter
        if (isset($options['withCount']) && is_array($options['withCount'])) {
            $query->withCount($options['withCount']);
        }

        // Apply filters from request using basic filters
        // (always use applyBasicFilters for consistency)
        $this->applyBasicFilters($query, $request);

        // Apply post-filter conditions (after filters)
        if (isset($options['postFilter']) && is_callable($options['postFilter'])) {
            $options['postFilter']($query, $request);
        }

        // Check if this is an export request
        if ($request->boolean('export')) {
            return $this->handleExport($query, $request, $resource, $options);
        }

        // Regular pagination for non-export requests
        $page = $request->input('current', 1);
        $perPage = $request->input('pageSize', 20);

        // Apply default sorting if not already applied
        if (!$query->getQuery()->orders) {
            $query->orderByDesc('updated_at');
        }

        $data = $query->paginate($perPage, ['*'], 'page', $page);

        return [
            'data' => $resource ? $resource::collection($data->items()) : $data->items(),
            'current' => $data->currentPage(),
            'pageSize' => $data->perPage(),
            'total' => $data->total(),
            'totalPages' => $data->lastPage(),
        ];
    }

    /**
     * Apply basic filters when model doesn't have scopeFilter
     */
    protected function applyBasicFilters($query, Request $request): void
    {
        // Handle search
        if ($request->filled('search')) {
            $search = strtolower($request->search);
            $searchable = $query->getModel()->searchable ?? ['name'];

            $query->where(function ($q) use ($search, $searchable) {
                foreach ($searchable as $field) {
                    if (str_contains($field, '.')) {
                        [$relation, $column] = explode('.', $field, 2);
                        $q->orWhereHas($relation, function ($rel) use ($column, $search) {
                            $rel->where($column, 'like', "%{$search}%");
                        });
                    } else {
                        $q->orWhere($field, 'like', "%{$search}%");
                    }
                }
            });
        }

        // Handle soft deleted
        if ($request->boolean('soft_deleted')) {
            $query->onlyTrashed();
        }

        // Handle sorting
        $sort = $request->input('sort', []);
        if (!empty($sort)) {
            foreach ($sort as $item) {
                $field = $item['field'] ?? $item['colId'] ?? null;
                $direction = $item['direction'] ?? $item['sort'] ?? 'asc';
                if ($field) {
                    $query->orderBy($field, $direction);
                }
            }
        }
    }

    /**
     * Handle export to Excel
     */
    protected function handleExport($query, Request $request, $resource = null, $options = []): BinaryFileResponse
    {
        // Get all data without pagination
        $data = $query->get();

        // Convert to array for Excel export
        if ($resource && $data->isNotEmpty()) {
            $resourceCollection = $resource::collection($data);
            $exportData = $resourceCollection->toArray($request);

            if (isset($exportData['data'])) {
                $exportData = $exportData['data'];
            }
        } else {
            $exportData = $data->toArray();
        }

        // Clean data
        $cleanedData = $this->cleanExportData($exportData);

        // Generate filename
        $modelName = class_basename($query->getModel());
        $timestamp = now()->format('Y-m-d_H-i-s');
        $filename = strtolower($modelName) . '_export_' . $timestamp . '.xlsx';

        return Excel::download(
            new class($cleanedData) implements \Maatwebsite\Excel\Concerns\FromArray, \Maatwebsite\Excel\Concerns\ShouldAutoSize, \Maatwebsite\Excel\Concerns\WithHeadings
            {
                private $data;

                public function __construct($data)
                {
                    $this->data = $data;
                }

                public function array(): array
                {
                    return $this->data;
                }

                public function headings(): array
                {
                    if (empty($this->data)) {
                        return [];
                    }
                    return array_keys($this->data[0]);
                }
            },
            $filename
        );
    }

    /**
     * Clean export data - remove non-scalar values
     */
    protected function cleanExportData(array $exportData): array
    {
        $cleanedData = [];

        foreach ($exportData as $row) {
            if (is_array($row)) {
                $cleanedRow = [];

                foreach ($row as $key => $value) {
                    // Skip fields ending with '_id'
                    if (str_ends_with($key, '_id')) {
                        continue;
                    }

                    $cleanedRow[$key] = $this->convertValueToExportFormat($value);
                }

                if (!empty($cleanedRow)) {
                    $cleanedData[] = $cleanedRow;
                }
            }
        }

        return $cleanedData;
    }

    /**
     * Convert value to export-friendly format
     */
    protected function convertValueToExportFormat($value): string
    {
        if (is_null($value)) {
            return '';
        }

        if (is_scalar($value)) {
            return (string) $value;
        }

        if ($value instanceof \Illuminate\Support\Collection) {
            return $this->extractNamesFromCollection($value->toArray());
        }

        if (is_array($value)) {
            return $this->extractNamesFromCollection($value);
        }

        if (is_object($value)) {
            if (method_exists($value, '__toString')) {
                return (string) $value;
            }
            return $this->extractNamesFromCollection((array) $value);
        }

        return (string) $value;
    }

    /**
     * Extract readable names from collection
     */
    protected function extractNamesFromCollection($data): string
    {
        if (isset($data['data']) && is_array($data['data'])) {
            $data = $data['data'];
        }

        if (empty($data)) {
            return '';
        }

        if (array_keys($data) === range(0, count($data) - 1)) {
            $names = [];
            foreach ($data as $item) {
                if (is_array($item)) {
                    $name = $this->extractDisplayName($item);
                    if ($name) {
                        $names[] = $name;
                    }
                }
            }
            return implode(' | ', $names);
        }

        return $this->extractDisplayName($data) ?: '';
    }

    /**
     * Extract display name from array
     */
    protected function extractDisplayName($item): ?string
    {
        if (!is_array($item)) {
            return null;
        }

        $nameFields = ['name', 'title', 'label', 'display_name', 'full_name'];

        foreach ($nameFields as $field) {
            if (isset($item[$field]) && !empty($item[$field])) {
                return (string) $item[$field];
            }
        }

        if (isset($item['id'])) {
            return "ID: {$item['id']}";
        }

        return 'Item';
    }
}
