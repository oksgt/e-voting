import { CheckSquare, Square } from "lucide-react";

interface PermissionGroupProps {
    group: string;
    perms: string[];
    selectedPermissions: string[];
    onToggleGroup: (perms: string[], selectAll: boolean) => void;
    onCheckboxChange: (perm: string, checked: boolean) => void;
}

export default function PermissionGroup({
    group,
    perms,
    selectedPermissions,
    onToggleGroup,
    onCheckboxChange,
}: PermissionGroupProps) {
    const allSelected = perms.every((perm) => selectedPermissions.includes(perm));

    return (
        <div className="border rounded p-2">
            <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-medium capitalize">{group} Permissions</p>
                <button
                    type="button"
                    onClick={() => onToggleGroup(perms, !allSelected)}
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
                {perms.map((perm) => (
                    <label key={perm} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            value={perm}
                            checked={selectedPermissions.includes(perm)}
                            onChange={(e) => onCheckboxChange(perm, e.target.checked)}
                            className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span className="text-sm">{perm}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}
