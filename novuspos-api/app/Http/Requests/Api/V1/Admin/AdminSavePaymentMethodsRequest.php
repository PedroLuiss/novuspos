<?php

namespace App\Http\Requests\Api\V1\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AdminSavePaymentMethodsRequest extends FormRequest
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
            'methods' => ['required', 'array'],
            'methods.*.id' => ['required', 'string', 'max:100'],
            'methods.*.label' => ['required', 'string', 'max:255'],
            'methods.*.description' => ['nullable', 'string'],
            'methods.*.icon' => ['nullable', 'string', 'max:100'],
            'methods.*.active' => ['required', 'boolean'],
            'methods.*.rows' => ['nullable', 'array'],
            'methods.*.rows.*.label' => ['required', 'string', 'max:255'],
            'methods.*.rows.*.value' => ['required', 'string', 'max:255'],
            'methods.*.rows.*.mono' => ['nullable', 'boolean'],
        ];
    }
}
