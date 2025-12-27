<?php

namespace App\Services;

use App\Models\Student;
use App\Models\Taxonomy;

class QuotaValidationService
{
    /**
     * FATA/Newly Merged Districts
     * These are the districts that fall under the special FATA/NMD quota
     */
    const FATA_DISTRICTS = [
        'Bajaur',
        'Mohmand',
        'Khyber',
        'Orakzai',
        'Kurram',
        'North Waziristan',
        'South Waziristan',
        // Additional merged districts
        'FR Peshawar',
        'FR Kohat',
        'FR Bannu',
        'FR Lakki Marwat',
        'FR Tank',
        'FR D.I.Khan',
    ];

    /**
     * Validate quota selection for a student
     *
     * @param Student $student
     * @param array $quotaIds Array of selected quota IDs
     * @return array Array of validation errors (empty if valid)
     */
    public function validate(Student $student, array $quotaIds): array
    {
        $errors = [];

        // Get quota names for validation
        $quotas = Taxonomy::whereIn('id', $quotaIds)->get();

        // Load student relations if not loaded
        $student->loadMissing(['gender', 'district', 'province']);

        $genderName = $student->gender?->name;
        $districtName = $student->district?->name;
        $provinceName = $student->province?->name;
        $religion = $student->religion?->value ?? $student->religion;

        // Check if student is from FATA district
        $isFataDistrict = $this->isFataDistrict($districtName);

        // Check if student is from Gilgit Baltistan
        $isGilgit = $provinceName && str_contains(strtolower($provinceName), 'gilgit');

        // Check if student is female
        $isFemale = $genderName && strtolower($genderName) === 'female';

        // Check if student is minority (non-Muslim)
        $isMinority = $religion && strtoupper($religion) === 'MINORITY';

        foreach ($quotas as $quota) {
            $quotaName = $quota->name;
            $quotaNameLower = strtolower($quotaName);

            // Female quota validation
            if (str_contains($quotaNameLower, 'female')) {
                if (!$isFemale) {
                    $errors[] = 'Female quota is only available for female candidates.';
                }
            }

            // Minority quota validation
            if (str_contains($quotaNameLower, 'minority')) {
                if (!$isMinority) {
                    $errors[] = 'Minority quota is only available for non-Muslim candidates.';
                }
                if (count($quotaIds) > 1) {
                    $errors[] = 'Minority candidates can only apply through Minority quota.';
                }
            }

            // FATA/NMD quota validation
            if (str_contains($quotaNameLower, 'fata') || str_contains($quotaNameLower, 'merged')) {
                if (!$isFataDistrict) {
                    $errors[] = 'FATA/Newly Merged Districts quota is only for candidates from those districts.';
                }
            }

            // Gilgit Baltistan quota validation
            if (str_contains($quotaNameLower, 'gilgit')) {
                if (!$isGilgit) {
                    $errors[] = 'Gilgit Baltistan quota is only for candidates from Gilgit Baltistan.';
                }
            }
        }

        // FATA candidates must use FATA quota
        if ($isFataDistrict) {
            $hasFataQuota = $quotas->contains(function ($quota) {
                $name = strtolower($quota->name);
                return str_contains($name, 'fata') || str_contains($name, 'merged');
            });

            if (!$hasFataQuota) {
                $errors[] = 'Candidates from Newly Merged Districts (FATA) must apply through the FATA quota.';
            }
        }

        // Gilgit candidates cannot apply for Open quota
        if ($isGilgit) {
            $hasOpenQuota = $quotas->contains(function ($quota) {
                return strtolower($quota->name) === 'open merit' ||
                       strtolower($quota->name) === 'open';
            });

            if ($hasOpenQuota) {
                $errors[] = 'Gilgit Baltistan candidates must apply through Gilgit Baltistan quota, not Open Merit.';
            }
        }

        // Female candidates outside FATA must use Female quota
        if ($isFemale && !$isFataDistrict) {
            $hasFemaleQuota = $quotas->contains(function ($quota) {
                return str_contains(strtolower($quota->name), 'female');
            });

            if (!$hasFemaleQuota) {
                $errors[] = 'Female candidates must apply through Female quota.';
            }
        }

        // Special quotas can only have max 2 selections
        $hasSpecialQuota = $quotas->contains(function ($quota) {
            $name = strtolower($quota->name);
            return str_contains($name, 'agriculture') ||
                   str_contains($name, 'asa') ||
                   str_contains($name, 'disabled');
        });

        if ($hasSpecialQuota && count($quotaIds) > 2) {
            $errors[] = 'You can only apply to a maximum of 2 quotas with special categories.';
        }

        // Disabled quota validation
        $hasDisabledQuota = $quotas->contains(function ($quota) {
            return str_contains(strtolower($quota->name), 'disabled');
        });

        if ($hasDisabledQuota && count($quotaIds) > 2) {
            $errors[] = 'Disabled candidates can only apply to Disabled quota and Open Merit.';
        }

        return array_unique($errors);
    }

    /**
     * Check if a district is a FATA/NMD district
     */
    protected function isFataDistrict(?string $districtName): bool
    {
        if (!$districtName) {
            return false;
        }

        foreach (self::FATA_DISTRICTS as $fataDistrict) {
            if (str_contains(strtolower($districtName), strtolower($fataDistrict))) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get eligible quotas for a student based on their profile
     *
     * @param Student $student
     * @param array $projectQuotaIds Available quotas for the project
     * @return array Array of eligible quota IDs
     */
    public function getEligibleQuotas(Student $student, array $projectQuotaIds): array
    {
        $allQuotas = Taxonomy::whereIn('id', $projectQuotaIds)->get();

        $student->loadMissing(['gender', 'district', 'province']);

        $genderName = $student->gender?->name;
        $districtName = $student->district?->name;
        $provinceName = $student->province?->name;
        $religion = $student->religion?->value ?? $student->religion;

        $isFataDistrict = $this->isFataDistrict($districtName);
        $isGilgit = $provinceName && str_contains(strtolower($provinceName), 'gilgit');
        $isFemale = $genderName && strtolower($genderName) === 'female';
        $isMinority = $religion && strtoupper($religion) === 'MINORITY';

        $eligibleQuotas = [];

        foreach ($allQuotas as $quota) {
            $quotaNameLower = strtolower($quota->name);
            $isEligible = true;

            // Female quota - only for females
            if (str_contains($quotaNameLower, 'female') && !$isFemale) {
                $isEligible = false;
            }

            // Minority quota - only for minorities
            if (str_contains($quotaNameLower, 'minority') && !$isMinority) {
                $isEligible = false;
            }

            // FATA quota - only for FATA districts
            if ((str_contains($quotaNameLower, 'fata') || str_contains($quotaNameLower, 'merged')) && !$isFataDistrict) {
                $isEligible = false;
            }

            // Gilgit quota - only for Gilgit province
            if (str_contains($quotaNameLower, 'gilgit') && !$isGilgit) {
                $isEligible = false;
            }

            // FATA candidates can only use FATA quota
            if ($isFataDistrict && !(str_contains($quotaNameLower, 'fata') || str_contains($quotaNameLower, 'merged'))) {
                $isEligible = false;
            }

            // Gilgit candidates cannot use Open quota
            if ($isGilgit && ($quotaNameLower === 'open merit' || $quotaNameLower === 'open')) {
                $isEligible = false;
            }

            if ($isEligible) {
                $eligibleQuotas[] = $quota->id;
            }
        }

        return $eligibleQuotas;
    }
}
