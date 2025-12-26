<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

trait Filterable
{
    /**
     * Apply filters, sorting, and pagination to query
     *
     * @param Builder $query
     * @param Request $request
     * @param array $searchableFields Fields to search in
     * @param array $filterableFields Fields that can be filtered
     * @return LengthAwarePaginator
     */
    public function scopeFilterAndPaginate(
        Builder $query,
        Request $request,
        array $searchableFields = [],
        array $filterableFields = []
    ): LengthAwarePaginator {
        // Apply search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search, $searchableFields) {
                foreach ($searchableFields as $field) {
                    if (str_contains($field, '.')) {
                        // Handle relationship field (e.g., 'user.email')
                        [$relation, $column] = explode('.', $field, 2);
                        $q->orWhereHas($relation, function ($subQuery) use ($column, $search) {
                            $subQuery->where($column, 'like', "%{$search}%");
                        });
                    } else {
                        $q->orWhere($field, 'like', "%{$search}%");
                    }
                }
            });
        }

        // Apply advanced filters (GlobalFilter format)
        if ($request->filled('filters')) {
            $filters = $request->filters;
            if (is_string($filters)) {
                $filters = json_decode($filters, true);
            }

            if (!empty($filters['conditions'])) {
                $type = $filters['type'] ?? 'AND';
                $method = strtolower($type) === 'or' ? 'orWhere' : 'where';

                $query->where(function ($q) use ($filters, $method, $filterableFields) {
                    foreach ($filters['conditions'] as $condition) {
                        $this->applyCondition($q, $condition, $method, $filterableFields);
                    }
                });
            }
        }

        // Apply sorting
        $sortField = $request->get('sort_field', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        if (str_contains($sortField, '.')) {
            // Handle relationship sorting
            [$relation, $column] = explode('.', $sortField, 2);
            // For now, just sort by the main table's created_at
            $query->orderBy('created_at', $sortOrder);
        } else {
            $query->orderBy($sortField, $sortOrder);
        }

        // Apply soft delete filter
        if ($request->filled('is_active')) {
            if ($request->is_active === 'false' || $request->is_active === '0') {
                $query->onlyTrashed();
            }
        }

        // Paginate
        $perPage = min((int) $request->get('per_page', 20), 100);
        $page = (int) $request->get('page', 1);

        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    /**
     * Apply a single filter condition
     */
    protected function applyCondition(Builder $query, array $condition, string $method, array $filterableFields): void
    {
        $field = $condition['field'] ?? null;
        $operator = $condition['operator'] ?? 'is';
        $value = $condition['value'] ?? null;

        if (!$field) {
            return;
        }

        // Handle relationship fields
        if (str_contains($field, '.')) {
            [$relation, $column] = explode('.', $field, 2);
            $query->{$method . 'Has'}($relation, function ($q) use ($column, $operator, $value) {
                $this->applyOperator($q, $column, $operator, $value);
            });
            return;
        }

        $query->$method(function ($q) use ($field, $operator, $value) {
            $this->applyOperator($q, $field, $operator, $value);
        });
    }

    /**
     * Apply operator-based filtering
     */
    protected function applyOperator(Builder $query, string $field, string $operator, $value): void
    {
        switch ($operator) {
            case 'is':
                if (is_array($value)) {
                    $query->whereIn($field, $value);
                } else {
                    $query->where($field, $value);
                }
                break;

            case 'is not':
                if (is_array($value)) {
                    $query->whereNotIn($field, $value);
                } else {
                    $query->where($field, '!=', $value);
                }
                break;

            case 'contains':
                $query->where($field, 'like', "%{$value}%");
                break;

            case 'does not contain':
                $query->where($field, 'not like', "%{$value}%");
                break;

            case 'starts with':
                $query->where($field, 'like', "{$value}%");
                break;

            case 'ends with':
                $query->where($field, 'like', "%{$value}");
                break;

            case 'is null':
                $query->whereNull($field);
                break;

            case 'is not null':
                $query->whereNotNull($field);
                break;

            case 'between':
                if (is_array($value) && count($value) === 2) {
                    $query->whereBetween($field, $value);
                }
                break;

            case 'greater than':
                $query->where($field, '>', $value);
                break;

            case 'greater than or equal':
                $query->where($field, '>=', $value);
                break;

            case 'less than':
                $query->where($field, '<', $value);
                break;

            case 'less than or equal':
                $query->where($field, '<=', $value);
                break;

            case 'after':
                $query->where($field, '>', $value);
                break;

            case 'before':
                $query->where($field, '<', $value);
                break;

            default:
                $query->where($field, $value);
        }
    }
}
