import { Button } from '@/components/ui/button';
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
import { BadgeCheck, Edit3, LoaderCircle, LucideCloudDownload, LucideDownload, LucideFileUp, LucideImport, LucideUpload, LucideUserPlus, Trash2Icon } from 'lucide-react';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { router } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { can } from "@/lib/can";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from '@/components/ui/field';
import { Label } from '@radix-ui/react-label';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'User', href: route('users.index') },
];

export default function User({ users, authUserId, csrfToken }) {

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [open, setOpen] = useState(false);
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5,
    });
    const [search, setSearch] = useState("");

    // Filter users by search text (name or email)
    const filteredUsers = useMemo(() => {
        const list = users?.data ?? users ?? [];

        if (!search) return list;

        return list.filter((u) => {
            const name = (u.name ?? "").toLowerCase();
            const email = (u.email ?? "").toLowerCase();
            const phone = (u.phone_number ?? "").toLowerCase();
            const nik = (u.nik ?? "").toLowerCase();

            return (
                name.includes(search.toLowerCase()) ||
                email.includes(search.toLowerCase()) ||
                phone.includes(search.toLowerCase()) ||
                nik.includes(search.toLowerCase())
            );
        });
    }, [users, search]);


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
                header: "NIK",
                accessorKey: "nik",
            },
            {
                header: "Phone Number",
                cell: ({ row }) => {
                    const phone = row.original.phone_number ?? "-";
                    const active = Number(row.original.whatsapp_active); // 0 or 1

                    return (
                        <div className="flex flex-col">
                            <span>{phone}</span>
                            {active === 1 ? (
                                <Badge className="bg-green-500 text-white mt-1 flex items-center gap-1">
                                    <BadgeCheck data-icon="inline-start" />Registered on WA
                                </Badge>
                            ) : (
                                <span className="text-gray-500 text-sm mt-1">Not registered</span>
                            )}
                        </div>
                    );
                },
            },
            {
                header: "Email",
                accessorKey: "email",
            },
            {
                header: "Roles",
                cell: ({ row }) => {
                    const roles = row.original.roles || [];
                    const maxVisible = 5;
                    const visibleRoles = roles.slice(0, maxVisible);
                    const remainingCount = roles.length - maxVisible;

                    return (
                        <div className="flex flex-wrap gap-1">
                            {roles.length > 0 ? (
                                <>
                                    {visibleRoles.map((perm: { id: number; name: string }) => (
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
                                <span className="text-gray-400 text-xs">No Roles</span>
                            )}
                        </div>
                    );
                },
            },
            {
                header: "Created At",
                accessorKey: "created_at",
                cell: ({ getValue }) =>
                    new Date(getValue()).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    }),
            },
            {
                header: "Actions",
                cell: ({ row }) => {
                    const user = row.original;
                    return (
                        <ButtonGroup>
                            {can("users.update") &&
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="outline" size="icon">
                                                <Link href={route("users.edit", user.id)}>
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

                            {user.id !== authUserId && can("users.delete") && (

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
                                                This will delete the user.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                className="bg-red-700 text-amber-50 hover:bg-red-800 hover:text-white transition-colors duration-200"
                                                onClick={() =>
                                                    router.delete(route("users.destroy", user.id), {
                                                        onSuccess: () => {
                                                            toast.success("User deleted successfully!", {
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
            }
        ],
        [pagination.pageIndex, pagination.pageSize]
    );

    // Create table instance
    const table = useReactTable({
        data: filteredUsers,
        columns,
        state: { sorting, pagination },
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await fetch(route("users.import"), {
                method: "POST",
                body: formData,
                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                },
            });

            const result = await response.json().catch(() => null);

            if (!response.ok || !result?.success) {
                // Laravel validation or custom error
                if (result?.errors) {
                    setErrorMsg(
                        result.errors
                            .map(
                                (err) =>
                                    `Row ${err.row_number ?? "?"}: ${err.messages.join(", ")}`
                            )
                            .join("\n")
                    );
                    toast.error(result.message || "Validation failed");
                } else {
                    setErrorMsg(result?.message || `Server error: ${response.status}`);
                    toast.error(result?.message || "Import failed");
                }
            } else {
                // Success case
                toast.success(result.message); // use backend message
                router.reload();
                setOpen(false);
            }
        } catch (err) {
            setErrorMsg(err.message);
            toast.error(`Network error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="w-full">
                    <CardHeader className="flex items-center justify-between">
                        <div>
                            <CardTitle>Data User</CardTitle>
                            <CardDescription className="mt-2">
                                List of registered users
                            </CardDescription>
                        </div>
                        {can("users.create") &&
                            <div className="flex gap-2">
                                <Button variant="default" size="sm" asChild>
                                    <Link
                                        href={route("users.create")}
                                        className="flex items-center gap-2"
                                    >
                                        <LucideUserPlus className="h-4 w-4" />
                                        <span>Add New User</span>
                                    </Link>
                                </Button>
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="flex items-center gap-2">
                                            <LucideFileUp className="h-4 w-4" />
                                            <span>Import from file</span>
                                        </Button>
                                    </DialogTrigger>

                                    <DialogContent className="sm:max-w-sm">
                                        <DialogHeader>
                                            <DialogTitle>Import From File</DialogTitle>
                                            <DialogDescription>
                                                Import new user data using CSV. Use the CSV template below as a basic template.
                                            </DialogDescription>
                                        </DialogHeader>

                                        {/* Form lives inside DialogContent */}
                                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                                            <FieldGroup>
                                                {/* CSV Template Download */}
                                                <Field>
                                                    <Label htmlFor="csv-template">CSV template</Label>
                                                    <Button
                                                        id="csv-template"
                                                        variant="outline"
                                                        size="sm"
                                                        className="mt-2 flex items-center gap-2"
                                                        asChild
                                                    >
                                                        <a href="/templates/users.csv" download>
                                                            <LucideDownload className="h-4 w-4" />
                                                            <span>Download Template</span>
                                                        </a>
                                                    </Button>
                                                </Field>

                                                {/* File Upload */}
                                                <Field>
                                                    <Label htmlFor="csv-upload">File Upload</Label>
                                                    <input
                                                        id="csv-upload"
                                                        name="file"
                                                        type="file"
                                                        accept=".csv"
                                                        className="mt-2 block w-auto text-xs text-gray-500
                                                        file:mr-2 file:py-1 file:px-2
                                                        file:rounded-md file:border-0
                                                        file:text-xs file:font-medium
                                                        file:bg-gray-100 file:text-gray-700
                                                        hover:file:bg-gray-200"
                                                        onChange={(e) => setSelectedFile(e.target.files[0])}
                                                    />
                                                    {selectedFile && (
                                                        <div className="mt-1 text-xs text-gray-600">{selectedFile.name}</div>
                                                    )}
                                                    {errorMsg && (
                                                        <div className="mt-1 text-xs text-red-600">{errorMsg}</div>
                                                    )}
                                                </Field>
                                            </FieldGroup>

                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button variant="outline" size="sm">Cancel</Button>
                                                </DialogClose>
                                                <Button type="submit" size="sm" className="flex items-center gap-2" disabled={loading}>
                                                    {loading ? (
                                                        <>
                                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                                            <span>Processing</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <LucideUpload className="h-4 w-4" />
                                                            <span>Upload</span>
                                                        </>
                                                    )}
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>

                        }
                    </CardHeader>

                    <CardContent>
                        {/* Search + Items per page controls */}
                        <div className="flex items-center justify-between mb-4">
                            <Input
                                type="text"
                                placeholder="Search by name, nik, phone number or email..."
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
        </AppLayout>
    );

}
