<?php

namespace App\Http\Requests\Api\V1\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AdminCreateEmailRequest extends FormRequest
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
            'subject' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'bodyText' => ['nullable', 'string'],
            'audience' => ['required', 'string', 'max:100'],
            'audienceLabel' => ['required', 'string', 'max:255'],
        ];
    }
}
