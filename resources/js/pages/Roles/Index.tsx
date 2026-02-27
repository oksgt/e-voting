import { Head, Link, router } from "@inertiajs/react";
import type { ColumnDef, OnChangeFn, PaginationState, SortingState } from "@tanstack/react-table";
import { AlertTriangle, Edit3, LucidePlus, ShieldCheck, Trash2Icon } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { route } from "ziggy-js";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import AppLayout from "@/layouts/app-layout";
import { can } from "@/lib/can";
import type { BreadcrumbItem, Pagination } from "@/types";
import type { Role } from "@/types/role";

const breadcrumbs: BreadcrumbItem[] = [{ title: "Roles", href: route("roles.index") }];

interface RolesProps {
    roles: Pagination<Role>;
}

export default function Roles({ roles }: RolesProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [search, setSearch] = useState("");

    const allRoles: Role[] = useMemo(() => roles?.data ?? [], [roles]);

    const filteredRoles = useMemo(() => {
        if (!search) return allRoles;
        return allRoles.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));
    }, [allRoles, search]);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    const pageCount = Math.ceil(filteredRoles.length / pagination.pageSize);

    const pagedRoles = useMemo(() => {
        const start = pagination.pageIndex * pagination.pageSize;
        return filteredRoles.slice(start, start + pagination.pageSize);
    }, [filteredRoles, pagination.pageIndex, pagination.pageSize]);

    const columns = useMemo<ColumnDef<Role>[]>(
        () => [
            {
                id: "no",
                header: "No",
                cell: ({ row }) => pagination.pageIndex * pagination.pageSize + row.index + 1,
                enableSorting: false,
            },
            {
                accessorKey: "name",
                header: "Name",
            },
            {
                id: "permissions",
                header: "Permissions",
                cell: ({ row }) => {
                    const perms = row.original.permissions ?? [];
                    const maxVisible = 5;
                    const visiblePerms = perms.slice(0, maxVisible);
                    const remainingCount = perms.length - maxVisible;

                    return (
                        <div className="flex flex-wrap gap-1">
                            {perms.length > 0 ? (
                                <>
                                    {visiblePerms.map((perm) => (
                                        <Badge key={perm.id} variant="secondary">
                                            {perm.name}
                                        </Badge>
                                    ))}
                                    {remainingCount > 0 && (
                                        <Badge variant="outline" className="bg-muted text-muted-foreground">
                                            +{remainingCount} more
                                        </Badge>
                                    )}
                                </>
                            ) : (
                                <span className="text-muted-foreground text-xs">No permissions</span>
                            )}
                        </div>
                    );
                },
                enableSorting: false,
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => {
                    const role = row.original;
                    return (
                        <ButtonGroup>
                            {can("roles.update") && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="outline" size="icon" asChild>
                                                <Link href={route("roles.edit", role.id)}>
                                                    <Edit3 className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Edit role</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}

                            {can("roles.delete") && (
                                <AlertDialog>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="outline" size="icon">
                                                        <Trash2Icon className="h-4 w-4 text-red-700" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Delete role</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will delete the role.
                                                <Alert variant="destructive" className="mt-3">
                                                    <AlertTriangle className="h-4 w-4" />
                                                    <AlertTitle>Warning</AlertTitle>
                                                    <AlertDescription>
                                                        Deleting this role will immediately revoke its permissions from all users who are assigned
                                                        to it. This action cannot be undone and may affect access to critical features. Please
                                                        proceed with caution.
                                                    </AlertDescription>
                                                </Alert>
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                className="bg-red-700 text-amber-50 hover:bg-red-800 hover:text-white transition-colors duration-200"
                                                onClick={() =>
                                                    router.delete(route("roles.destroy", role.id), {
                                                        onSuccess: () => {
                                                            toast.success("Role deleted successfully!", {
                                                                style: { backgroundColor: "green", color: "white" },
                                                            });
                                                        },
                                                    })
                                                }
                                            >
                                                Yes, delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                        </ButtonGroup>
                    );
                },
                enableSorting: false,
            },
        ],
        [pagination.pageIndex, pagination.pageSize],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="border-primary/10 shadow-lg">
                    <CardHeader className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-primary" />
                                Data Roles
                            </CardTitle>
                            <CardDescription className="mt-1">
                                {allRoles.length} role{allRoles.length !== 1 ? "s" : ""} registered
                            </CardDescription>
                        </div>
                        {can("roles.create") && (
                            <Button variant="default" size="sm" asChild>
                                <Link href={route("roles.create")} className="flex items-center gap-2">
                                    <LucidePlus className="h-4 w-4" />
                                    <span>Add New Role</span>
                                </Link>
                            </Button>
                        )}
                    </CardHeader>

                    <CardContent className="space-y-4 pt-2">
                        <DataTable
                            columns={columns}
                            data={pagedRoles}
                            sorting={sorting}
                            onSortingChange={setSorting as OnChangeFn<SortingState>}
                            pagination={pagination}
                            onPaginationChange={setPagination as OnChangeFn<PaginationState>}
                            pageCount={pageCount}
                            loading={false}
                            globalFilter={search}
                            onGlobalFilterChange={handleSearchChange}
                            searchPlaceholder="Search by role name..."
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
