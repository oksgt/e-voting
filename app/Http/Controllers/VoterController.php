<?php

namespace App\Http\Controllers;

use App\Http\Requests\Voters\ApproveVoterRequest;
use App\Http\Requests\Voters\DestroyVoterRequest;
use App\Http\Requests\Voters\RejectVoterRequest;
use App\Http\Requests\Voters\StoreVoterRequest;
use App\Http\Requests\Voters\UpdateVoterRequest;
use App\Http\Resources\UserCollection;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class VoterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        if (!auth()->user()->hasRole('Admin')) {
            abort(403, 'Unauthorized');
        }

        $search         = $request->input('search');
        $per_page       = $request->per_page ?? 10;
        $sort_by        = $request->sort_by;
        $sort_direction = $request->sort_direction;
        $status         = $request->input('status'); // pending | approved | rejected

        // Base scope: only Voter-role users
        $voterScope = User::whereHas('roles', function ($q) {
            $q->where('name', 'Voter');
        });

        // Status counts (always across all voters, unaffected by search/status filter)
        $rawCounts     = (clone $voterScope)->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');
        $statusCounts  = [
            'total'    => $rawCounts->sum(),
            'pending'  => $rawCounts->get('pending', 0),
            'approved' => $rawCounts->get('approved', 0),
            'rejected' => $rawCounts->get('rejected', 0),
        ];

        $users = (clone $voterScope)
            ->with('roles')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('nik', 'like', "%{$search}%")
                        ->orWhere('bidang', 'like', "%{$search}%")
                        ->orWhere('phone_number', 'like', "%{$search}%");
                });
            })
            ->when($status, fn($q) => $q->where('status', $status))
            ->when(
                $sort_by && in_array($sort_by, ['name', 'email', 'created_at', 'status', 'bidang']),
                fn($q) => $q->orderBy($sort_by, $sort_direction ?? 'asc'),
                fn($q) => $q->orderBy('created_at', 'desc')
            )
            ->paginate($per_page);

        return Inertia::render('Voters/Index', [
            'users'        => new UserCollection($users),
            'authUserId'   => $request->user()->id,
            'statusCounts' => $statusCounts,
            'filters'      => [
                'per_page'       => $per_page,
                'search'         => $search,
                'status'         => $status,
                'sort_by'        => $sort_by,
                'sort_direction' => $sort_direction,
            ],
            'csrfToken' => csrf_token(),
        ]);
    }

    public function create()
    {
        if (!auth()->user()->hasRole('Admin')) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('Voters/Create', [
            'roles' => Role::pluck('name'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreVoterRequest $request)
    {
        // Build base user data
        $userData = [
            'name'          => $request->name,
            'email'         => $request->email,
            'nik'           => $request->nik,
            'phone_number'  => $request->phone_number,
            'bidang'        => $request->bidang,
            'login_method'  => $request->login_method,
            'status'        => 'pending',
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
            ->route('voters.index')
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
    public function edit(User $voter)
    {
        if (!auth()->user()->hasRole('Admin')) {
            abort(403, 'Unauthorized');
        }
        return Inertia::render('Voters/Edit', [
            'user'      => $voter->load('roles'),
            'roles'     => Role::pluck('name'),
            'userRoles' => $voter->roles->pluck('name'),
        ]);
    }


    /**
     * Update the specified user in storage.
     */
    public function update(UpdateVoterRequest $request, User $voter)
    {
        $validated = $request->validated();

        // Build update data
        // $updateData = [
        //     'name'         => $validated['name'],
        //     'email'        => $validated['email'],
        //     'nik'          => $validated['nik'] ?? $voter->nik,
        //     'phone_number' => $validated['phone_number'] ?? $voter->phone_number,
        //     'bidang'       => $validated['bidang'] ?? null,
        // ];
        $updateData = $validated;

        if (!empty($validated['password'])) {
            $updateData['password'] = bcrypt($validated['password']);
        }

        // Track whether anything changed
        $changesMade = false;

        // Fill model first, then check if any attribute actually changed
        $voter->fill($updateData);
        if ($voter->isDirty()) {
            $voter->save();
            $changesMade = true;
        }

        // Sync roles if provided
        if (!empty($validated['roles'])) {
            $voter->syncRoles($validated['roles']);
            $changesMade = true;
        }

        // Redirect with appropriate message
        return redirect()
            ->route('voters.index')
            ->with(
                $changesMade ? 'success' : 'info',
                $changesMade ? 'Voter updated successfully.' : 'No changes were made.'
            );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DestroyVoterRequest $request, User $voter)
    {
        if (!auth()->user()->hasRole('Admin')) {
            abort(403, 'Unauthorized');
        }

        $voter->delete();

        return redirect()
            ->route('voters.index')
            ->with('success', 'Voter deleted successfully.');
    }

    /**
     * Approve the specified voter.
     */
    public function approve(ApproveVoterRequest $request, User $voter)
    {
        if ($voter->status === 'approved') {
            return back()->with('info', 'Voter is already approved.');
        }

        $voter->update(['status' => 'approved']);

        return back()->with('success', 'Voter approved successfully.');
    }

    /**
     * Reject the specified voter.
     */
    public function reject(RejectVoterRequest $request, User $voter)
    {
        if ($voter->status === 'rejected') {
            return back()->with('info', 'Voter is already rejected.');
        }

        $voter->update(['status' => 'rejected']);

        return back()->with('success', 'Voter rejected successfully.');
    }

    public function checkPhoneNumber(Request $request, string $phone)
    {
        // Fetch token from settings table
        $token = DB::table('settings')
            ->where('key', 'fonnte_token')
            ->value('value');

        if (!$token) {
            return response()->json(['error' => 'Fonnte token is not configured in settings.'], 422);
        }

        /** @var \Illuminate\Http\Client\Response $response */
        $response = Http::withHeaders([
            'Authorization' => $token,
        ])->post('https://api.fonnte.com/validate', [
            'target'      => $phone,
            'countryCode' => '62',
        ]);

        return response()->json($response->json());
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
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'No users imported.',
            'errors'  => $errors,
        ], 422);
    }
}
