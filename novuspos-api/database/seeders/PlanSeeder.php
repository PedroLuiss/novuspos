<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'slug' => 'novus-mensual',
                'name' => 'NovusPOS Mensual',
                'description' => 'Todo el sistema para un comercio, en una computadora.',
                'price' => 4.99,
                'currency' => 'USD',
                'interval' => 'month',
                'highlighted' => true,
                'active' => true,
                'features' => [
                    'Ventas, inventario y caja en el mismo equipo',
                    'Clientes y cuentas corrientes',
                    'Respaldos de tu información',
                    'Actualizaciones y soporte',
                ],
            ],
            [
                'slug' => 'novus-anual',
                'name' => 'NovusPOS Anual',
                'description' => 'El mismo sistema, pagando una sola vez al año.',
                'price' => 59.99,
                'currency' => 'USD',
                'interval' => 'year',
                'highlighted' => false,
                'active' => true,
                'features' => [
                    'Ventas, inventario y caja en el mismo equipo',
                    'Clientes y cuentas corrientes',
                    'Respaldos de tu información',
                    'Actualizaciones y soporte',
                    'Un solo pago al año, sin mensualidades',
                ],
            ],
        ];

        foreach ($plans as $plan) {
            Plan::query()->updateOrCreate(['slug' => $plan['slug']], $plan);
        }
    }
}
