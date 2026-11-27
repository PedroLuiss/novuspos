<?php

namespace App\Http\Requests\Api\V1\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AdminSavePlansRequest extends FormRequest
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
            'plans' => ['required', 'array'],
            'plans.*.id' => ['required', 'string', 'max:100'],
            'plans.*.name' => ['required', 'string', 'max:255'],
            'plans.*.description' => ['nullable', 'string'],
            'plans.*.price' => ['required', 'numeric', 'min:0'],
            'plans.*.currency' => ['required', 'string', 'max:10'],
            'plans.*.interval' => ['required', 'string', 'in:month,year'],
            'plans.*.features' => ['nullable', 'array'],
            'plans.*.features.*' => ['string'],
            'plans.*.highlighted' => ['nullable', 'boolean'],
            'plans.*.active' => ['required', 'boolean'],
        ];
    }
}
