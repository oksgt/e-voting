<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AnggotaKoperasiRequest extends FormRequest
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
        $anggotaId = $this->route('anggota_koperasi')?->id;

        return [
            'nama' => ['required', 'string', 'max:255'],
            'nik' => [
                'required',
                'string',
                'max:20',
                Rule::unique('anggota_koperasi', 'nik')
                    ->ignore($anggotaId),
            ],
            'bidang' => ['required', 'string', Rule::exists('bidang', 'nama_bidang')],
            'nowa' => ['required', 'string', 'max:20'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'nama.required' => 'Nama wajib diisi.',
            'nama.string' => 'Nama harus berupa teks.',
            'nama.max' => 'Nama maksimal 255 karakter.',
            'nik.required' => 'NIK wajib diisi.',
            'nik.string' => 'NIK harus berupa teks.',
            'nik.max' => 'NIK maksimal 20 karakter.',
            'nik.unique' => 'NIK sudah terdaftar.',
            'bidang.required' => 'Bidang wajib dipilih.',
            'bidang.exists' => 'Bidang yang dipilih tidak valid.',
            'nowa.required' => 'Nomor WhatsApp wajib diisi.',
            'nowa.string' => 'Nomor WhatsApp harus berupa teks.',
            'nowa.max' => 'Nomor WhatsApp maksimal 20 karakter.',
        ];
    }
}
