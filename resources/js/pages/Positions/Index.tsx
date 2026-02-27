import { Head, Link, router } from "@inertiajs/react";
import type { ColumnDef } from "@tanstack/react-table";
import { BadgeCheck, BadgeX, Edit3, Tag, Trash2Icon, Users } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";
import { route } from "ziggy-js";

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
import { usePositionPage } from "@/hooks/use-position-page";
import AppLayout from "@/layouts/app-layout";
import { can } from "@/lib/can";
import type { BreadcrumbItem } from "@/types";
import type { PositionComponentProps } from "@/types/position";

const breadcrumbs: BreadcrumbItem[] = [{ title: "Position", href: route("positions.index") }];

export default function PositionIndex({ positions, filters }: PositionComponentProps) {
    const { sorting, onSortingChange, pagination, onPaginationChange, searchQuery, handleSearchChange } = usePositionPage({
        currentPage: positions.meta.current_page,
        perPage: positions.meta.per_page,
        filters,
    });

    const columns = useMemo<ColumnDef<PositionComponentProps["positions"]["data"][number]>[]>(
        () => [
            {
                id: "no",
                header: "No",
                cell: ({ row }) => {
                    const from = positions.meta.from ?? 0;
                    return from + row.index;
                },
                enableSorting: false,
            },
            {
                header: "Position Name",
                accessorKey: "name",
            },
            {
                header: "Description",
                accessorKey: "description",
            },
            {
                header: "Status",
                accessorKey: "status",
                cell: ({ row }) => {
                    const status = row.getValue("status");
                    const isActive = status === 1 || status === "active";

                    return (
                        <Badge
                            variant={isActive ? "secondary" : "destructive"}
                            className={`flex items-center gap-1 px-2 py-1 ${isActive ? "bg-green-100 text-green-700 border border-green-300  " : ""
                                }`}
                        >
                            {isActive ? (
                                <BadgeCheck className="h-4 w-4" data-icon="inline-start" />
                            ) : (
                                <BadgeX className="h-4 w-4" data-icon="inline-start" />
                            )}
                            {isActive ? "Active" : "Not Active"}
                        </Badge>
                    );
                },
            },

            {
                header: "Actions",
                cell: ({ row }) => {
                    const position = row.original;
                    return (
                        <ButtonGroup>
                            {can("positions.update") && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="outline" size="icon" asChild>
                                                <Link href={route("positions.edit", position.id)}>
                                                    <Edit3 className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Edit item</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}

                            {can("positions.delete") && (
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
                                            <AlertDialogDescription>This will delete the Position.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                className="bg-red-700 text-amber-50 hover:bg-red-800 hover:text-white transition-colors duration-200"
                                                onClick={() =>
                                                    router.delete(route("positions.destroy", position.id), {
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
            },
        ],
        [positions.meta.from],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Position" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="w-full border-primary/10 shadow-lg">
                    <CardHeader className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                Data Position
                            </CardTitle>
                            <CardDescription className="mt-1">
                                {positions.meta.total} position{positions.meta.total !== 1 ? "s" : ""} found
                            </CardDescription>
                        </div>
                        {can("positions.create") && (
                            <div className="flex gap-2">
                                <Button variant="default" size="sm" asChild>
                                    <Link href={route("positions.create")} className="flex items-center gap-2">
                                        <Tag className="h-4 w-4" />
                                        <span>Add New Position</span>
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </CardHeader>

                    <CardContent className="space-y-4 pt-2">
                        <DataTable
                            columns={columns}
                            data={positions.data}
                            sorting={sorting}
                            onSortingChange={onSortingChange}
                            pagination={pagination}
                            onPaginationChange={onPaginationChange}
                            pageCount={positions.meta.last_page}
                            loading={false}
                            globalFilter={searchQuery}
                            onGlobalFilterChange={handleSearchChange}
                            searchPlaceholder="Search by position name or description..."
                            noDataMessage="No positions found."
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
