<?php

namespace App\Http\Requests\Voters;

use Illuminate\Foundation\Http\FormRequest;

class ApproveVoterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasPermissionTo('voters.update') ?? false;
    }

    /** No body payload — route model binding only. */
    public function rules(): array
    {
        return [];
    }
}
