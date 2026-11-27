<?php

namespace App\Http\Requests\Api\V1\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AdminReviewPaymentRequest extends FormRequest
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
            'approved' => ['required', 'boolean'],
            'note' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
