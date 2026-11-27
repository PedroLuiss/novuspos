<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        Role::query()->firstOrCreate([
            'name' => 'super-admin',
            'guard_name' => 'web',
        ]);

        Role::query()->firstOrCreate([
            'name' => 'client',
            'guard_name' => 'web',
        ]);

        $admin = User::query()->firstOrCreate(
            ['email' => 'admin@novuspos.com'],
            [
                'name' => 'Super Admin',
                'organization_name' => 'NovusPOS',
                'business_sector' => 'Tecnología',
                'password' => Hash::make('NovusPOS123*'),
                'email_verified_at' => now(),
            ],
        );

        if (! $admin->hasRole('super-admin')) {
            $admin->assignRole('super-admin');
        }
    }
}
