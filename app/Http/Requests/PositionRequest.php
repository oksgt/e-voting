<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PositionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Sesuaikan dengan kebutuhan, misalnya hanya admin
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('positions', 'name')->ignore($this->position->id),
            ],
            'description' => 'nullable|string|max:500',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama posisi wajib diisi.',
            'name.string'   => 'Nama posisi harus berupa teks.',
            'name.max'      => 'Nama posisi maksimal 100 karakter.',
            'name.unique'   => 'Nama posisi sudah digunakan, silakan pilih nama lain.',
            'description.string' => 'Deskripsi harus berupa teks.',
            'description.max'    => 'Deskripsi maksimal 500 karakter.',
        ];
    }
}
