<?php

namespace App\Http\Requests\Api\V1\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AdminUploadLandingDownloadRequest extends FormRequest
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
            'file' => ['required', 'file', 'extensions:exe', 'max:524288'],
            'version' => ['nullable', 'string', 'max:50'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'file.required' => 'Selecciona el instalador .exe para subirlo.',
            'file.file' => 'El instalador debe ser un archivo válido.',
            'file.extensions' => 'El archivo debe ser un instalador .exe.',
            'file.max' => 'El instalador no puede superar los 512 MB.',
        ];
    }
}
