<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleRequest;
use App\Http\Resources\RoleCollection;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        if (! auth()->user()->hasRole('Admin')) {
            abort(403, 'Unauthorized');
        }

        $per_page = $request->input('per_page', 10);
        $search = $request->input('search');

        $roles = Role::with('permissions')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate($per_page);

        return Inertia::render('Roles/Index', [
            'roles' => new RoleCollection($roles),
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        if (! auth()->user()->hasRole('Admin')) {
            abort(403, 'Unauthorized');
        }
        $permissions = Permission::pluck('name')->toArray();

        $grouped = collect($permissions)->groupBy(function ($perm) {
            return explode('.', $perm)[0]; // ambil prefix sebelum titik
        });

        return Inertia::render('Roles/Create', [
            'groupedPermissions' => $grouped,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RoleRequest $request)
    {
        $role = Role::create([
            'name' => $request->name,
        ]);

        $role->syncPermissions($request->permissions);

        return to_route('roles.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        if (! auth()->user()->hasRole('Admin')) {
            abort(403, 'Unauthorized');
        }
        $role = Role::with('permissions')->findOrFail($id);

        // Get all permissions grouped by prefix (before the first dot)
        $groupedPermissions = Permission::all()
            ->groupBy(fn ($perm) => Str::before($perm->name, '.'))
            ->map(fn ($group) => $group->pluck('name')->values());

        // Get the role’s assigned permission names
        $selectedPermissions = $role->permissions->pluck('name')->toArray();

        return Inertia::render('Roles/Edit', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->map(fn ($p) => ['name' => $p->name]),
            ],
            'groupedPermissions' => $groupedPermissions,
            'selectedPermissions' => $selectedPermissions,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $role = Role::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,'.$role->id,
            'permissions' => 'array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        // Update role name
        $role->update([
            'name' => $validated['name'],
        ]);

        // Sync permissions
        $role->syncPermissions($validated['permissions'] ?? []);

        return redirect()
            ->route('roles.index')
            ->with('success', 'Role updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $role = Role::findOrFail($id);

        // Soft delete the role
        $role->delete();

        return redirect()
            ->route('roles.index')
            ->with('success', 'Role deleted successfully.');
    }
}
