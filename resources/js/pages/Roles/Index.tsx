import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table"
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { ButtonGroup } from '@/components/ui/button-group';
import { AlertTriangle, Edit3, LucidePlus, Trash2Icon } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { can } from '@/lib/can';


const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Roles', href: route('roles.index') },
];

export default function Roles({ roles, authUserId }) {
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5, // show 5 rows per page
    });

    const [search, setSearch] = useState("");

    // Filter users by search text (name or email)
    const filteredRoles = useMemo(() => {
        const list = roles?.data ?? roles ?? [];

        if (!search) return list;
        return list.filter(
            (u) =>
                u.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [roles, search]);

    // Define columns
    const columns = useMemo(
        () => [
            {
                header: "No",
                cell: ({ row }) => row.index + 1 + pagination.pageIndex * pagination.pageSize,
            },
            {
                header: "Name",
                accessorKey: "name",
            },
            {
                header: "Permissions",
                cell: ({ row }) => {
                    const perms = row.original.permissions || [];
                    const maxVisible = 5;
                    const visiblePerms = perms.slice(0, maxVisible);
                    const remainingCount = perms.length - maxVisible;

                    return (
                        <div className="flex flex-wrap gap-1">
                            {perms.length > 0 ? (
                                <>
                                    {visiblePerms.map((perm: { id: number; name: string }) => (
                                        <Badge key={perm.id} variant="secondary">
                                            {perm.name}
                                        </Badge>
                                    ))}
                                    {remainingCount > 0 && (
                                        <Badge variant="outline" className="bg-gray-100 text-gray-600">
                                            {remainingCount} more
                                        </Badge>
                                    )}
                                </>
                            ) : (
                                <span className="text-gray-400 text-xs">No permissions</span>
                            )}
                        </div>
                    );
                },
            },
            {
                header: "Actions",
                cell: ({ row }) => {
                    const role = row.original;
                    return (
                        <ButtonGroup>
                            {can("roles.update") &&
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" size="icon">
                                            <Link href={route("roles.edit", role.id)}>
                                                <Edit3 className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Edit item</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            }

                            {can("roles.delete") &&
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Trash2Icon className="h-4 w-4 text-red-700" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Delete item</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </Button>
                                </AlertDialogTrigger>

                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will delete the role.
                                            <Alert variant="destructive" className="mt-3">
                                                <AlertTriangle className="h-4 w-4" />
                                                <AlertTitle>Warning</AlertTitle>
                                                <AlertDescription>
                                                    Deleting this role will immediately revoke its permissions from all users who are assigned to it.
                                                    This action cannot be undone and may affect access to critical features.
                                                    Please proceed with caution.
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
                            }
                        </ButtonGroup>
                    );
                },
            }
            //show permission data here in a new column "Permissions"
        ],
        [pagination.pageIndex, pagination.pageSize]
    );

    // Create table instance
    const table = useReactTable({
        data: filteredRoles,
        columns,
        state: { sorting, pagination },
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="w-full">
                    <CardHeader className="flex items-center justify-between">
                        <div>
                            <CardTitle>Data Roles</CardTitle>
                            <CardDescription className='mt-2'>List of user role</CardDescription>
                        </div>
                        {can("roles.create") &&
                            <Button variant="default" size="sm" asChild>
                                <Link href={route('roles.create')} className="flex items-center gap-2">
                                    <LucidePlus className="h-4 w-4" />
                                    <span>Add New Role</span>
                                </Link>
                            </Button>
                        }
                </CardHeader>

                <CardContent>
                    {/* Search + Items per page controls */}
                    <div className="flex items-center justify-between mb-4">
                        <Input
                            type="text"
                            placeholder="Search by role name"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-1/3"
                        />
                        <div className="flex items-center gap-2">
                            <span>Rows per page:</span>
                            <Select
                                value={String(pagination.pageSize)}
                                onValueChange={(value) =>
                                    setPagination((prev) => ({
                                        ...prev,
                                        pageSize: Number(value),
                                    }))
                                }
                            >
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue placeholder="Rows per page" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[5, 10, 20, 50].map((size) => (
                                        <SelectItem key={size} value={String(size)}>
                                            {size}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            onClick={header.column.getToggleSortingHandler?.()}
                                            className="cursor-pointer select-none"
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {{
                                                asc: " 🔼",
                                                desc: " 🔽",
                                            }[header.column.getIsSorted()] ?? null}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination Controls */}
                    <div className="flex items-center justify-between mt-4">
                        <Button
                            variant="outline"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </Button>
                        <span>
                            Page {table.getState().pagination.pageIndex + 1} of{" "}
                            {table.getPageCount()}
                        </span>
                        <Button
                            variant="outline"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
        </AppLayout >
    );
}
