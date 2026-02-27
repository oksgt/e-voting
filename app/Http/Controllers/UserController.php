<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\MagicLinks;
use App\Models\User;
use App\Rules\ValidPhoneNumber;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

use function Pest\Laravel\json;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index(Request $request)
    {
        $search = $request->input('search');

        $users = User::with('roles')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Users/Index', [
            'users'      => $users,
            'authUserId' => auth()->id(),
            'filters'    => [
                'search' => $search,
            ],
            'csrfToken' => csrf_token(),
        ]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Users/Create', [
            "roles" => Role::pluck('name')
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request)
    {
        // Build base user data
        $userData = [
            'name'          => $request->name,
            'email'         => $request->email,
            'nik'           => $request->nik,
            'phone_number'  => $request->phone_number,
            'login_method'  => $request->login_method,
        ];

        // Only set password if login method is password or both
        if (in_array($request->login_method, ['password', 'both']) && $request->filled('password')) {
            $userData['password'] = bcrypt($request->password);
        }

        $user = User::create($userData);

        // Assign roles safely (only if roles are provided)
        if ($request->filled('roles')) {
            $user->syncRoles($request->roles);
        }

        // Update whatsapp_active based on validation result
        if ($request->phone_number) {
            $rule = new \App\Rules\ValidPhoneNumber;
            $rule->validate('phone_number', $request->phone_number, function () {});
            $user->update(['whatsapp_active' => $rule->isRegistered ? 1 : 0]);
        }

        return redirect()
            ->route('users.index')
            ->with('success', 'User created successfully.');
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user)
    {
        return Inertia::render('Users/Edit', [
            // user data for prefill
            'user' => $user->load('roles'), // eager load roles relationship

            // all available role names
            'roles' => Role::pluck('name'),

            // current roles assigned to this user
            'userRoles' => $user->roles->pluck('name'),
        ]);
    }


    /**
     * Update the specified user in storage.
     */
    public function update(UserRequest $request, User $user)
    {
        $validated = $request->validated();

        // Build update data
        $updateData = [
            'name'  => $validated['name'],
            'email' => $validated['email'],
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = bcrypt($validated['password']);
        }

        // Track whether anything changed
        $changesMade = false;

        // Update user fields if dirty
        if ($user->isDirty($updateData)) {
            $user->update($updateData);
            $changesMade = true;
        }

        // Sync roles if provided
        if (!empty($validated['roles'])) {
            $user->syncRoles($validated['roles']);
            $changesMade = true;
        }

        // Redirect with appropriate message
        return redirect()
            ->route('users.index')
            ->with(
                $changesMade ? 'success' : 'info',
                $changesMade ? 'User updated successfully.' : 'No changes were made.'
            );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        // Prevent self-deletion
        if (auth()->id() === $user->id) {
            return redirect()
                ->route('users.index')
                ->with('error', 'You cannot delete your own account.');
        }

        // Soft delete other users
        $user->delete();

        return redirect()
            ->route('users.index')
            ->with('success', 'User deleted successfully.');
    }

    public function checkPhoneNumber(Request $request, string $phone)
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
            'target'      => $phone,
            'countryCode' => '62',
        ]);

        dd($response->json());
    }

    public function importCsv(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:csv,txt|max:2048',
        ]);

        $file = $request->file('file');
        $handle = fopen($file->getRealPath(), 'r');

        // Detect delimiter dynamically from the first line
        $firstLine = fgets($handle);
        $delimiter = strpos($firstLine, ';') !== false ? ';' : ',';

        // Reset pointer and parse header
        rewind($handle);
        $header = fgetcsv($handle, 0, $delimiter);

        $header = array_map(function ($h) {
            // Remove BOM, trim spaces, lowercase
            return strtolower(preg_replace('/^\xEF\xBB\xBF/', '', trim($h)));
        }, $header);

        $imported = 0;
        $errors = [];
        $rowNumber = 1; // start counting after header

        while (($row = fgetcsv($handle, 0, $delimiter)) !== false) {
            $rowNumber++;

            $row = array_map(function ($value) {
                return preg_replace('/^\xEF\xBB\xBF/', '', trim($value));
            }, $row);

            // Safeguard: skip rows with mismatched column count
            if (count($row) !== count($header)) {
                $errors[] = [
                    'row_number' => $rowNumber,
                    'row' => $row,
                    'messages' => [
                        "Row has " . count($row) . " values, expected " . count($header)
                    ],
                ];
                continue;
            }

            $data = array_combine($header, $row);

            // Basic validation
            $validator = Validator::make($data, [
                'nik' => [
                    'nullable',
                    'string',
                    'max:16',
                    Rule::unique('users', 'nik')->whereNull('deleted_at'),
                ],
                'name' => 'required|string|max:255',
                'phone_number' => [
                    'nullable',
                    'string',
                    'max:255',
                    Rule::unique('users', 'phone_number')->whereNull('deleted_at'),
                ],
                'email' => [
                    'required',
                    'email',
                    Rule::unique('users', 'email')->whereNull('deleted_at'),
                ],
            ], [
                'nik.unique'          => 'NIK already exists in the system.',
                'name.required'       => 'Name is required.',
                'phone_number.unique' => 'Phone number is already registered.',
                'email.unique'        => 'Email address is already registered.',
                'email.required'      => 'Email is required.',
                'email.email'         => 'Email must be a valid format.',
            ]);

            if ($validator->fails()) {
                $errors[] = [
                    'row_number' => $rowNumber,
                    'row' => $row,
                    'messages' => $validator->errors()->all(),
                ];
                continue;
            }


            // Build base user data
            $userData = [
                'nik'          => $data['nik'] ?? null,
                'name'         => $data['name'],
                'phone_number' => $data['phone_number'] ?? null,
                'email'        => $data['email'],
                'login_method' => 'magic_link', // default
            ];

            $user = User::create($userData);
            $user->syncRoles('Voter');

            // Run ValidPhoneNumber rule to update whatsapp_active
            if (!empty($data['phone_number'])) {
                $rule = new \App\Rules\ValidPhoneNumber;
                $rule->validate('phone_number', $data['phone_number'], function () {});
                $user->update(['whatsapp_active' => $rule->isRegistered ? 1 : 0]);
            }

            $imported++;
        }

        fclose($handle);

        if ($imported > 0) {
            return response()->json([
                'success' => true,
                'message' => "Imported {$imported} users successfully.",
                'errors'  => $errors,
                'data'    => $data
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'No users imported.',
            'errors'  => $errors,
        ], 422);
    }

    public function testingBroadcast(Request $request)
    {
        // Fetch token dari settings
        $token = DB::table('settings')
            ->where('key', 'fonnte_token')
            ->value('value');

        if (!$token) {
            return response()->json([
                'status'  => false,
                'message' => 'Fonnte token not found'
            ], 404);
        }

        $userWhatsapp = User::where('whatsapp_active', '1')
            ->select('name', 'phone_number')
            ->get();

            $message = "Hai, {name}. Terima kasih sudah registrasi.\n\n" .
                "Silahkan gunakan link berikut untuk login:\n\n" .
                "{var1}" . "\n\n" .
                "Terima kasih sudah bergabung!";

        $result = $userWhatsapp->map(function ($user) {
            return $user->phone_number . "|" . $user->name . "|" . $this->generateMagicLink($user->phone_number);
        });

        // Gabungkan semua target jadi satu string
        $target = $result->implode(',');

        $response = Http::withHeaders([
            'Authorization' => $token,
        ])->post('https://api.fonnte.com/send', [
            'target'    => $target,
            'message'   => $message,
            'delay'     => '2',
        ]);

        return response()->json([
            'status_code' => $response->status(),
            'success'     => $response->successful(),
            'data'        => $response->json(), // isi JSON dari Fonnte
            'raw'         => $response->body(), // isi mentah
        ]);
    }

    private function generateMagicLink($phone_number)
    {
        if (empty($phone_number)) {
            return null; // atau bisa lempar exception
        }

        // Cari user berdasarkan nomor telepon
        $user = User::where('phone_number', $phone_number)->first();

        if (!$user) {
            return null;
        }

        // Cek apakah sudah ada magic link aktif
        $existingLink = MagicLinks::where('user_id', $user->id)
            ->where('expired_at', '>', now())
            ->first();

        if ($existingLink) {
            return url("/magic-login/{$existingLink->token}");
        }

        // Generate token baru
        $token = Str::random(40);

        $expiration = (int) DB::table('settings')
            ->where('key', 'magic_link_expiration')
            ->value('value');

        // Simpan magic link baru
        MagicLinks::create([
            'user_id'    => $user->id,
            'token'      => hash('sha256', $token),
            'expired_at' => now()->addMinutes($expiration)
        ]);

        // Return URL magic link
        return url("/magic-login/{$token}");
    }
}
