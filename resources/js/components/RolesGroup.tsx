import { CheckSquare, Square } from "lucide-react";
import { useMemo } from "react";

interface PermissionGroupProps {
    roles: string[];
    selectedRoles: string[];
    onToggleGroup: (perms: string[], selectAll: boolean) => void;
    onCheckboxChange: (perm: string, checked: boolean) => void;
}

export default function RolesGroup({
    roles,
    selectedRoles,
    onToggleGroup,
    onCheckboxChange,
}: PermissionGroupProps) {
    const allSelected = useMemo(
        () => roles.length > 0 && roles.every((role) => selectedRoles.includes(role)),
        [roles, selectedRoles]
    );

    return (
        <div className="border rounded p-2">
            <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-medium capitalize">Available Roles</p>
                <button
                    type="button"
                    aria-label={allSelected ? "Deselect all roles" : "Select all roles"}
                    onClick={() => onToggleGroup(roles, !allSelected)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                >
                    {allSelected ? (
                        <>
                            <CheckSquare className="h-4 w-4" />
                            <span className="text-xs">Deselect all</span>
                        </>
                    ) : (
                        <>
                            <Square className="h-4 w-4" />
                            <span className="text-xs">Select all</span>
                        </>
                    )}
                </button>
            </div>

            <div className="space-y-1">
                {roles.map((role) => (
                    <label key={role} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            value={role}
                            checked={selectedRoles.includes(role)}
                            onChange={(e) => onCheckboxChange(role, e.target.checked)}
                            className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span className="text-sm">{role}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}
