<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\User;

class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // Support both 'user' (users resource) and 'voter' (voters resource) route parameters
        $routeUser = $this->route('user') ?? $this->route('voter');
        $userId = $routeUser instanceof User ? $routeUser->id : ($routeUser ?? null);

        $loginMethod = $this->input('login_method', 'password'); // default to password

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($userId),
            ],

            'nik' => [
                'nullable', // allow empty if not mandatory
                'string',
                'size:16', // exactly 16 characters
                Rule::unique('users', 'nik')->ignore($userId),
            ],

            'phone_number' => [
                'nullable',
                'string',
                'max:20', // adjust based on your format
            ],

            'bidang' => [
                'nullable',
                'string',
                'max:255',
            ],

            'login_method' => ['required', Rule::in(['password', 'magic_link', 'both'])],

            'password' => [
                // Required only if login method is password or both
                in_array($loginMethod, ['password', 'both']) ? 'required' : 'nullable',
                'string',
                'min:8',
                in_array($loginMethod, ['password', 'both']) ? 'confirmed' : '',
            ],

            'roles' => ['required', 'array', 'min:1'],
            'roles.*' => ['string', Rule::exists('roles', 'name')],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Name is required.',
            'name.string'   => 'Name must be a valid string.',
            'name.max'      => 'Name may not be greater than 255 characters.',

            'email.required' => 'Email is required.',
            'email.email'    => 'Please enter a valid email address.',
            'email.unique'   => 'This email is already taken. Please use another one.',

            'password.required'   => 'Password is required.',
            'password.string'     => 'Password must be a valid string.',
            'password.min'        => 'Password must be at least 8 characters.',
            'password.confirmed'  => 'Password confirmation does not match.',

            'roles.required' => 'At least one role must be selected.',
            'roles.array'    => 'Roles must be an array.',
            'roles.min'      => 'You must select at least one role.',
            'roles.*.string' => 'Each role must be a valid string.',
            'roles.*.exists' => 'One or more roles do not exist.',

            'login_method.required' => 'Please select a login method.',
            'login_method.in'       => 'Login method must be either password, magic_link, or both.',

            'nik.string' => 'NIK must be a valid string.',
            'nik.size'   => 'NIK must be exactly 16 digits.',
            'nik.unique' => 'This NIK is already registered.',

            'phone_number.string' => 'Phone number must be a valid string.',
            'phone_number.max'    => 'Phone number may not be greater than 20 characters.',

        ];
    }
}
