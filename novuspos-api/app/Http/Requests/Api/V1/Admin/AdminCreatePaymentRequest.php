<?php

namespace App\Http\Requests\Api\V1\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdminCreatePaymentRequest extends FormRequest
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
            'userId' => ['required', 'integer', 'exists:users,id'],
            'planId' => ['required', 'string', 'max:100'],
            'amount' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:10'],
            'method' => ['required', 'string', 'max:100'],
            'reference' => ['required', 'string', 'max:255'],
            'bank' => ['nullable', 'string', 'max:255'],
            'paidAt' => ['required', 'date'],
            'status' => ['required', Rule::in(['approved', 'pending'])],
            'note' => ['nullable', 'string', 'max:1000'],
            'proofDataUrl' => ['nullable', 'string'],
        ];
    }
}
