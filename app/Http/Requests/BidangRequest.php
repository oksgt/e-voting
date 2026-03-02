<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BidangRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $bidangId = $this->route('bidang')?->id;

        return [
            'nama_bidang' => [
                'required',
                'string',
                'max:100',
                Rule::unique('bidang', 'nama_bidang')
                    ->ignore($bidangId),
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'nama_bidang.required' => 'Nama bidang wajib diisi.',
            'nama_bidang.string' => 'Nama bidang harus berupa teks.',
            'nama_bidang.max' => 'Nama bidang maksimal 100 karakter.',
            'nama_bidang.unique' => 'Nama bidang sudah digunakan, silakan pilih nama lain.',
        ];
    }
}
