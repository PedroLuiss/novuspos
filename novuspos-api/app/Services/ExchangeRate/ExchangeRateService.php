<?php

namespace App\Services\ExchangeRate;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class ExchangeRateService
{
    /**
     * @return array{rate: float, currency: string, date: string, source?: string, fallback?: bool}
     */
    public function today(): array
    {
        return Cache::remember('exchange-rate:bcv', now()->addHours(6), function (): array {
            try {
                $response = Http::timeout(8)->get('https://ve.dolarapi.com/v1/dolares/oficial');

                if ($response->ok()) {
                    $data = $response->json();
                    $rate = (float) ($data['promedio'] ?? $data['rate'] ?? 0);
                    $date = isset($data['fechaActualizacion'])
                        ? substr((string) $data['fechaActualizacion'], 0, 10)
                        : now()->toDateString();

                    if ($rate > 0) {
                        return [
                            'rate' => $rate,
                            'currency' => 'USD',
                            'date' => $date,
                            'source' => 'BCV',
                        ];
                    }
                }
            } catch (\Throwable) {
                // fallback below
            }

            return [
                'rate' => 36.5,
                'currency' => 'USD',
                'date' => now()->toDateString(),
                'source' => 'BCV',
                'fallback' => true,
            ];
        });
    }
}
