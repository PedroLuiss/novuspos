<?php

namespace App\Http\Requests\Api\V1\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AdminSaveSettingsRequest extends FormRequest
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
            'companyName' => ['required', 'string', 'max:255'],
            'contactEmail' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:500'],
            'loginPath' => ['required', 'string', 'max:255'],
        ];
    }
}
