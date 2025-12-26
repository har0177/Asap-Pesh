<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Role;
use App\Models\Taxonomy;
use App\Enums\TaxonomyTypeEnum;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DropdownController extends Controller
{
    /**
     * Get dropdown options based on type
     */
    public function __invoke(Request $request, string $type): JsonResponse
    {
        $search = $request->input('q', '');
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
            default => [],
        };

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    protected function getRoles(string $search): array
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

    protected function getProjects(string $search): array
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

    protected function getTaxonomyByType(TaxonomyTypeEnum $type, string $search): array
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
