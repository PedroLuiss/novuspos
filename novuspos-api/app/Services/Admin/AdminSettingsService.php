<?php

namespace App\Services\Admin;

use App\Models\AdminSetting;

class AdminSettingsService
{
    /**
     * @return array<string, mixed>
     */
    public function get(): array
    {
        $setting = AdminSetting::query()->latest('id')->first();

        if (! $setting) {
            return [
                'companyName' => 'NovusPOS',
                'contactEmail' => 'soporte@novuspos.com',
                'phone' => '',
                'address' => '',
                'loginPath' => '/acceso-maestro',
            ];
        }

        return $this->toArray($setting);
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function save(array $data): array
    {
        $setting = AdminSetting::query()->latest('id')->first();

        $payload = [
            'company_name' => $data['companyName'] ?? 'NovusPOS',
            'contact_email' => $data['contactEmail'] ?? '',
            'phone' => $data['phone'] ?? '',
            'address' => $data['address'] ?? '',
            'login_path' => $data['loginPath'] ?? '/acceso-maestro',
        ];

        if ($setting) {
            $setting->update($payload);
            $setting = $setting->fresh();
        } else {
            $setting = AdminSetting::query()->create($payload);
        }

        return $this->toArray($setting);
    }

    /**
     * @return array<string, mixed>
     */
    private function toArray(AdminSetting $setting): array
    {
        return [
            'companyName' => $setting->company_name,
            'contactEmail' => $setting->contact_email,
            'phone' => $setting->phone ?? '',
            'address' => $setting->address ?? '',
            'loginPath' => $setting->login_path ?: '/acceso-maestro',
        ];
    }
}
