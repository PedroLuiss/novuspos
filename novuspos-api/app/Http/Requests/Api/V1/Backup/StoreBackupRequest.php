<?php

namespace App\Http\Requests\Api\V1\Backup;

use Illuminate\Foundation\Http\FormRequest;

class StoreBackupRequest extends FormRequest
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
            'database' => ['required', 'file', 'max:102400'],
            'created_at' => ['required', 'string'],
            'sha256' => ['nullable', 'string', 'max:128'],
            'source' => ['nullable', 'string', 'max:50'],
        ];
    }
}
