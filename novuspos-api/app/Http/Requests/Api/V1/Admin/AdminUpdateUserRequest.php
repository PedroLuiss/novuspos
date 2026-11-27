<?php

namespace App\Http\Requests\Api\V1\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AdminUpdateUserRequest extends FormRequest
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
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255'],
            'businessName' => ['sometimes', 'string', 'max:255'],
            'businessType' => ['sometimes', 'nullable', 'string', 'max:255'],
        ];
    }
}
