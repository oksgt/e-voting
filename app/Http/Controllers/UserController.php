<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\User;
use App\Rules\ValidPhoneNumber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

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
            $rule->validate('phone_number', $request->phone_number, function() {});
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
        // $rule = new ValidPhoneNumber();

        // // Run validation manually
        // $errors = [];
        // $rule->validate('phone_number', $phone, function ($message) use (&$errors) {
        //     $errors[] = $message;
        // });

        // if (!empty($errors)) {
        //     return response()->json([
        //         'status' => false,
        //         'errors' => $errors,
        //         'whatsapp_active' => 0,
        //     ], 422);
        // }

        // return response()->json([
        //     'status' => true,
        //     'message' => 'Phone number is valid and registered.',
        //     'whatsapp_active' => $rule->isRegistered ? 1 : 0,
        // ]);
    }

}
