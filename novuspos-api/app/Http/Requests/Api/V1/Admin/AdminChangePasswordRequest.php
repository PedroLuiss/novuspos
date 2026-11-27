<?php

namespace App\Http\Requests\Api\V1\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AdminChangePasswordRequest extends FormRequest
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
            'currentPassword' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'max:10', 'confirmed'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('passwordConfirmation') && ! $this->has('password_confirmation')) {
            $this->merge(['password_confirmation' => $this->input('passwordConfirmation')]);
        }
    }
}
