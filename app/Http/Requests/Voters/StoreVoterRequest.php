<?php

namespace App\Http\Requests\Voters;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVoterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasPermissionTo('voters.register') ?? false;
    }

    public function rules(): array
    {
        $loginMethod = $this->input('login_method', 'magic_link');
        $needsPassword = in_array($loginMethod, ['password', 'both'], true);

        return [
            'name' => ['required', 'string', 'max:255'],

            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->whereNull('deleted_at'),
            ],

            'nik' => [
                'nullable',
                'string',
                'size:16',
                'regex:/^\d{16}$/',
                Rule::unique('users', 'nik')->whereNull('deleted_at'),
            ],

            'phone_number' => ['nullable', 'string', 'max:20'],

            'bidang' => ['nullable', 'string', 'max:255'],

            'login_method' => ['required', Rule::in(['password', 'magic_link', 'both'])],

            'password' => [
                $needsPassword ? 'required' : 'nullable',
                'string',
                'min:8',
                'confirmed',
            ],

            'roles' => ['required', 'array', 'min:1'],
            'roles.*' => ['string', Rule::exists('roles', 'name')],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'         => 'Name is required.',
            'name.max'              => 'Name may not exceed 255 characters.',
            'email.required'        => 'Email is required.',
            'email.email'           => 'Please enter a valid email address.',
            'email.unique'          => 'This email is already registered.',
            'nik.size'              => 'NIK must be exactly 16 digits.',
            'nik.regex'             => 'NIK must contain only digits.',
            'nik.unique'            => 'This NIK is already registered.',
            'phone_number.max'      => 'Phone number may not exceed 20 characters.',
            'login_method.required' => 'Please select a login method.',
            'login_method.in'       => 'Login method must be password, magic_link, or both.',
            'password.required'     => 'Password is required for the selected login method.',
            'password.min'          => 'Password must be at least 8 characters.',
            'password.confirmed'    => 'Password confirmation does not match.',
            'roles.required'        => 'At least one role must be selected.',
            'roles.min'             => 'At least one role must be selected.',
            'roles.*.exists'        => 'One or more selected roles do not exist.',
        ];
    }
}
