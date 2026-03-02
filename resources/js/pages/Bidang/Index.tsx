import { Head, Link, router } from "@inertiajs/react";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit3, Layers, Plus, Trash2Icon } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useBidangPage } from "@/hooks/use-bidang-page";
import AppLayout from "@/layouts/app-layout";
import { can } from "@/lib/can";
import type { BreadcrumbItem } from "@/types";
import type { BidangComponentProps } from "@/types/bidang";

const breadcrumbs: BreadcrumbItem[] = [{ title: "Bidang", href: route("bidang.index") }];

export default function BidangIndex({ bidang, filters }: BidangComponentProps) {
    const { sorting, onSortingChange, pagination, onPaginationChange, searchQuery, handleSearchChange } = useBidangPage({
        currentPage: bidang.meta.current_page,
        perPage: bidang.meta.per_page,
        filters,
    });

    const columns = useMemo<ColumnDef<BidangComponentProps["bidang"]["data"][number]>[]>(
        () => [
            {
                id: "no",
                header: "No",
                cell: ({ row }) => {
                    const from = bidang.meta.from ?? 0;
                    return from + row.index;
                },
                enableSorting: false,
            },
            {
                header: "Nama Bidang",
                accessorKey: "nama_bidang",
            },
            {
                header: "Actions",
                cell: ({ row }) => {
                    const item = row.original;
                    return (
                        <ButtonGroup>
                            {can("bidang.update") && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="outline" size="icon" asChild>
                                                <Link href={route("bidang.edit", item.id)}>
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

                            {can("bidang.delete") && (
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
                                            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                                            <AlertDialogDescription>Data bidang ini akan dihapus.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Batal</AlertDialogCancel>
                                            <AlertDialogAction
                                                className="bg-red-700 text-amber-50 hover:bg-red-800 hover:text-white transition-colors duration-200"
                                                onClick={() =>
                                                    router.delete(route("bidang.destroy", item.id), {
                                                        onSuccess: () => {
                                                            toast.success("Bidang berhasil dihapus!", {
                                                                style: { backgroundColor: "green", color: "white" },
                                                            });
                                                        },
                                                    })
                                                }
                                            >
                                                Ya, hapus
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
        [bidang.meta.from],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bidang" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="w-full border-primary/10 shadow-lg">
                    <CardHeader className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Layers className="h-5 w-5 text-primary" />
                                Data Bidang
                            </CardTitle>
                            <CardDescription className="mt-1">
                                {bidang.meta.total} bidang ditemukan
                            </CardDescription>
                        </div>
                        {can("bidang.create") && (
                            <div className="flex gap-2">
                                <Button variant="default" size="sm" asChild>
                                    <Link href={route("bidang.create")} className="flex items-center gap-2">
                                        <Plus className="h-4 w-4" />
                                        <span>Tambah Bidang</span>
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </CardHeader>

                    <CardContent className="space-y-4 pt-2">
                        <DataTable
                            columns={columns}
                            data={bidang.data}
                            sorting={sorting}
                            onSortingChange={onSortingChange}
                            pagination={pagination}
                            onPaginationChange={onPaginationChange}
                            pageCount={bidang.meta.last_page}
                            loading={false}
                            globalFilter={searchQuery}
                            onGlobalFilterChange={handleSearchChange}
                            searchPlaceholder="Cari berdasarkan nama bidang..."
                            noDataMessage="Tidak ada bidang ditemukan."
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
