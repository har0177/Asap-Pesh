<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Role;
use App\Models\Taxonomy;
use App\Enums\TaxonomyTypeEnum;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DropdownController extends Controller
{
    /**
     * Valid dropdown types for validation
     */
    private const VALID_TYPES = [
        'roles', 'projects', 'diplomas', 'sessions', 'sections',
        'genders', 'blood_groups', 'provinces', 'districts', 'quotas'
    ];

    /**
     * Get dropdown options based on type
     */
    public function __invoke(Request $request, string $type): JsonResponse
    {
        // Validate the type parameter
        if (!in_array($type, self::VALID_TYPES)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid dropdown type',
                'data' => [],
            ], 400);
        }

        // Sanitize and limit search input
        $search = Str::limit($request->input('q', ''), 100);
        $search = preg_replace('/[^\p{L}\p{N}\s\-_.]/u', '', $search);
        $params = $request->except(['q', 'type']);

        $data = match ($type) {
            'roles' => $this->getRoles($search),
            'projects' => $this->getProjects($search),
            'diplomas' => $this->getTaxonomyByType(TaxonomyTypeEnum::DIPLOMA, $search),
            'sessions' => $this->getTaxonomyByType(TaxonomyTypeEnum::SESSION, $search),
            'sections' => $this->getTaxonomyByType(TaxonomyTypeEnum::SECTION, $search),
            'genders' => $this->getTaxonomyByType(TaxonomyTypeEnum::GENDER, $search),
            'blood_groups' => $this->getTaxonomyByType(TaxonomyTypeEnum::BLOODGROUP, $search),
            'provinces' => $this->getTaxonomyByType(TaxonomyTypeEnum::PROVINCE, $search),
            'districts' => $this->getTaxonomyByType(TaxonomyTypeEnum::DISTRICT, $search),
            'quotas' => $this->getTaxonomyByType(TaxonomyTypeEnum::QUOTA, $search),
            default => [],
        };

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    protected function getRoles(?string $search): array
    {
        $query = Role::query();

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        return $query->orderBy('name')
            ->limit(50)
            ->get()
            ->map(fn($role) => [
                'id' => $role->id,
                'label' => $role->name,
            ])
            ->toArray();
    }

    protected function getProjects(?string $search): array
    {
        $query = Project::query();

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        return $query->orderBy('name')
            ->limit(50)
            ->get()
            ->map(fn($project) => [
                'id' => $project->id,
                'label' => $project->name,
            ])
            ->toArray();
    }

    protected function getTaxonomyByType(string $type, ?string $search): array
    {
        $query = Taxonomy::where('type', $type);

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        return $query->orderBy('name')
            ->limit(50)
            ->get()
            ->map(fn($taxonomy) => [
                'id' => $taxonomy->id,
                'label' => $taxonomy->name,
            ])
            ->toArray();
    }
}
