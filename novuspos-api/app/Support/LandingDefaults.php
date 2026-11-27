<?php

namespace App\Support;

class LandingDefaults
{
    /**
     * @return array<string, mixed>
     */
    public static function config(): array
    {
        $path = database_path('data/landing-defaults.json');

        if (! file_exists($path)) {
            return [];
        }

        $decoded = json_decode((string) file_get_contents($path), true);

        return is_array($decoded) ? $decoded : [];
    }
}
