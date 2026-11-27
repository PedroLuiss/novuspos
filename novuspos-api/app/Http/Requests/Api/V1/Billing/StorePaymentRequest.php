<?php

namespace App\Http\Requests\Api\V1\Billing;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'subscriptionId' => ['required'],
            'planId' => ['required', 'string'],
            'method' => ['required', 'string', 'max:50'],
            'reference' => ['required', 'string', 'max:255'],
            'paidAt' => ['required', 'date'],
            'bank' => ['required', 'string', 'max:255'],
            'proofName' => ['nullable', 'string', 'max:255'],
            'proofDataUrl' => ['nullable', 'string'],
        ];
    }
}
