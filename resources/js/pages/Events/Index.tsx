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
import { BadgeCheck, BadgeX, Calendar, CheckCircle, Clock, Edit3, LoaderCircle, LucideCloudDownload, LucideDownload, LucideFileUp, LucideImport, LucideUpload, LucideUserPlus, PlayCircle, Plus, PlusCircle, Tag, Trash2Icon, WandSparkles, XCircle } from 'lucide-react';
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
    { title: 'Events', href: route('events.index') },
];

export default function User({ events, authUserId, csrfToken }) {

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5,
    });
    const [search, setSearch] = useState("");

    // Filter users by search text (name or email)
    const filteredUsers = useMemo(() => {
        const list = events?.data ?? events ?? [];

        if (!search) return list;

        return list.filter((u) => {
            const name = (u.name ?? "").toLowerCase();
            const description = (u.description ?? "").toLowerCase();

            return (
                name.includes(search.toLowerCase()) ||
                description.includes(search.toLowerCase())
            );
        });
    }, [events, search]);


    // Define columns
    const columns = useMemo(
        () => [
            {
                header: "No",
                cell: ({ row }) => row.index + 1 + pagination.pageIndex * pagination.pageSize,
            },
            {
                header: "Event Name",
                accessorKey: "name",
            },
            {
                header: "Keyword",
                accessorKey: "keyword",
            },
            {
                header: "Start at",
                accessorKey: "start_date",
                cell: ({ getValue }) => {
                    const value = getValue()
                    if (!value) return "-"

                    return new Date(value).toLocaleString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })
                },
            },
            {
                header: "Status",
                accessorKey: "status",
                cell: ({ row }) => {
                    const status = row.getValue("status")

                    let variant = "secondary"
                    let classes = "flex items-center gap-1 px-2 py-1"
                    let icon = null
                    let label = ""

                    switch (status) {
                        case "pending":
                            variant = "secondary"
                            classes += " bg-gray-100 text-gray-700 border border-gray-300"
                            icon = <Clock className="h-4 w-4" data-icon="inline-start" />
                            label = "Pending"
                            break

                        case "scheduled":
                            variant = "secondary"
                            classes += " bg-blue-100 text-blue-700 border border-blue-300"
                            icon = <Calendar className="h-4 w-4" data-icon="inline-start" />
                            label = "Scheduled"
                            break

                        case "running":
                            variant = "secondary"
                            classes += " bg-green-100 text-green-700 border border-green-300"
                            icon = <PlayCircle className="h-4 w-4" data-icon="inline-start" />
                            label = "Running"
                            break

                        case "finished":
                            variant = "secondary"
                            classes += " bg-purple-100 text-purple-700 border border-purple-300"
                            icon = <CheckCircle className="h-4 w-4" data-icon="inline-start" />
                            label = "Finished"
                            break

                        case "cancelled":
                            variant = "destructive"
                            classes += " bg-red-100 text-red-700 border border-red-300"
                            icon = <XCircle className="h-4 w-4" data-icon="inline-start" />
                            label = "Cancelled"
                            break

                        default:
                            label = status
                    }

                    return (
                        <Badge variant={variant} className={classes}>
                            {icon}
                            {label}
                        </Badge>
                    )
                },
            },
            {
                header: "Actions",
                cell: ({ row }) => {
                    const user = row.original;
                    return (
                        <ButtonGroup>
                            {can("elections.update") &&
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="outline" size="icon">
                                                <Link href={route("events.edit", user.id)}>
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


                            {can("elections.delete") && (

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
                                                This will delete the event.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                className="bg-red-700 text-amber-50 hover:bg-red-800 hover:text-white transition-colors duration-200"
                                                onClick={() =>
                                                    router.delete(route("events.destroy", user.id), {
                                                        onSuccess: () => {
                                                            toast.success("Position deleted successfully!", {
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="w-full">
                    <CardHeader className="flex items-center justify-between">
                        <div>
                            <CardTitle>Data Events</CardTitle>
                            <CardDescription className="mt-2">
                                List of events
                            </CardDescription>
                        </div>
                        {can("elections.create") &&
                            <div className="flex gap-2">
                                <Button variant="default" size="sm" asChild>
                                    <Link
                                        href={route("events.create")}
                                        className="flex items-center gap-2"
                                    >
                                        <PlusCircle className="h-4 w-4" />
                                        <span>Add New events</span>
                                    </Link>
                                </Button>
                            </div>

                        }
                    </CardHeader>

                    <CardContent>
                        {/* Search + Items per page controls */}
                        <div className="flex items-center justify-between mb-4">
                            <Input
                                type="text"
                                placeholder="Search by position name, keyword..."
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
