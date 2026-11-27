<?php

namespace Database\Seeders;

use App\Models\PaymentMethod;
use Illuminate\Database\Seeder;

class PaymentMethodSeeder extends Seeder
{
    public function run(): void
    {
        $methods = [
            [
                'slug' => 'mobile',
                'label' => 'Pago Móvil',
                'description' => 'Transfiere desde tu banco y reporta la referencia.',
                'icon' => 'smartphone',
                'active' => true,
                'rows' => [
                    ['label' => 'Banco', 'value' => 'Banco de Venezuela'],
                    ['label' => 'Teléfono', 'value' => '0414-0000000', 'mono' => true],
                    ['label' => 'RIF', 'value' => 'J-00000000-0', 'mono' => true],
                ],
            ],
            [
                'slug' => 'transfer',
                'label' => 'Transferencia',
                'description' => 'Envía una transferencia bancaria y reporta el comprobante.',
                'icon' => 'account_balance',
                'active' => true,
                'rows' => [
                    ['label' => 'Banco', 'value' => 'Banco de Venezuela'],
                    ['label' => 'Cuenta', 'value' => '0102-0000-0000-0000-0000', 'mono' => true],
                    ['label' => 'Titular', 'value' => 'NovusPOS C.A.'],
                    ['label' => 'RIF', 'value' => 'J-00000000-0', 'mono' => true],
                ],
            ],
        ];

        foreach ($methods as $method) {
            PaymentMethod::query()->updateOrCreate(['slug' => $method['slug']], $method);
        }
    }
}
