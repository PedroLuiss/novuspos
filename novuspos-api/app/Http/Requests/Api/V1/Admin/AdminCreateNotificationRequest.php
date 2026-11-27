<?php

namespace App\Http\Requests\Api\V1\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AdminCreateNotificationRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'link' => ['nullable', 'string', 'max:500'],
            'icon' => ['nullable', 'string', 'max:100'],
            'type' => ['required', 'string', 'in:info,success,warning'],
            'audience' => ['required', 'string', 'max:100'],
            'audienceLabel' => ['required', 'string', 'max:255'],
        ];
    }
}
