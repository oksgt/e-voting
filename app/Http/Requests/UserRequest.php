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
        $routeUser = $this->route('user');
        $userId = $routeUser instanceof User ? $routeUser->id : ($routeUser ?? null);

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($userId),
            ],
            'password' => [
                $this->isMethod('post') ? 'required' : 'nullable',
                'string',
                'min:8',
                $this->isMethod('post') ? 'confirmed' : '',
            ],
            // Require roles and ensure at least one is selected
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
        ];
    }
}
