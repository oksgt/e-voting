<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class ValidPhoneNumber implements ValidationRule
{
    public bool $isRegistered = false; // expose result

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Fetch token from settings table
        $token = DB::table('settings')
            ->where('key', 'fonnte_token')
            ->value('value');

        if (!$token) {
            $fail("Fonnte token is not configured in settings.");
            return;
        }

        $response = Http::withHeaders([
            'Authorization' => $token,
        ])->post('https://api.fonnte.com/validate', [
            'target'      => $value,
            'countryCode' => '62',
        ]);

        if ($response->failed()) {
            $fail("Unable to validate {$attribute} at the moment.");
            return;
        }

        $data = $response->json();

        if (!isset($data['status']) || $data['status'] !== true) {
            $reason = $data['reason'] ?? 'Phone number is invalid.';
            $fail("{$attribute} validation failed: {$reason}");
            return;
        }

        // Normalize input number to international format (62…)
        $normalized = preg_replace('/^0/', '62', $value);

        // Mark as registered if API says so
        if (!empty($data['registered']) && in_array($normalized, $data['registered'])) {
            $this->isRegistered = true;
        } else {
            $this->isRegistered = false;
            $fail("The {$attribute} is not registered on WhatsApp.");
        }
    }
}
