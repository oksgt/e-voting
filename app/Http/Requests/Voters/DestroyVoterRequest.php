<?php

namespace App\Http\Requests\Voters;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class DestroyVoterRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var User $voter */
        $voter = $this->route('voter');

        // Prevent self-deletion at the request level
        if ($this->user()?->id === ($voter instanceof User ? $voter->id : $voter)) {
            return false;
        }

        return $this->user()?->hasPermissionTo('voters.delete') ?? false;
    }

    /** No body payload — route model binding only. */
    public function rules(): array
    {
        return [];
    }

    public function failedAuthorization(): never
    {
        $voter = $this->route('voter');
        $isSelf = $this->user()?->id === ($voter instanceof User ? $voter->id : $voter);

        if ($isSelf) {
            abort(403, 'You cannot delete your own account.');
        }

        abort(403, 'You are not authorized to delete voters.');
    }
}
