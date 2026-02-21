<?php

namespace App\Http\Controllers;

use App\Models\MagicLinks;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class MagicLinksController extends Controller
{
    public function generateMagicLinks(Request $request, $phone_number)
    {
        if (empty($phone_number)) {
            return response()->json([
                'message' => 'Phone number is required.',
            ], 422);
        }

        // Find the user by phone number
        $user = User::where('phone_number', $phone_number)->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        // Check if there is already an active magic link
        $existingLink = MagicLinks::where('user_id', $user->id)
            ->where('expired_at', '>', now())
            ->first();

        if ($existingLink) {
            $url = url("/magic-login/{$existingLink->token}");
            return response()->json([
                'message' => 'Magic link already active.',
                'url'     => $url,
            ]);
        }

        // Generate new token
        $token = Str::random(40);

        // Create magic link record tied to user_id
        $link = MagicLinks::create([
            'user_id'    => $user->id,
            'token'      => hash('sha256', $token),
            'expired_at' => Carbon::now()->addMinutes(15),
        ]);

        $url = url("/magic-login/{$token}");

        return response()->json([
            'message' => 'Magic link generated successfully.',
            'url'     => $url,
        ]);
    }


    public function verifyMagicLink($token)
    {
        $hashed = hash('sha256', $token);

        $link = MagicLinks::where('token', $hashed)
            ->where('expired_at', '>', now())
            ->first();

        if (! $link) {
            return redirect('/login')->with('error', 'Link tidak valid atau sudah expired.');
        }

        // Get the user directly by ID
        $user = User::find($link->user_id);

        if (! $user) {
            return redirect('/login')->with('error', 'User tidak ditemukan.');
        }

        Auth::login($user);

        // Delete the magic link so it can’t be reused
        $link->delete();

        return redirect('/dashboard')->with('success', 'Berhasil login tanpa password!');
    }

}
