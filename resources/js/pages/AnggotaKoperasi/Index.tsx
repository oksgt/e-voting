import { Head, Link, router } from "@inertiajs/react";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit3, Plus, Trash2Icon, Users } from "lucide-react";
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
import { useAnggotaKoperasiPage } from "@/hooks/use-anggota-koperasi-page";
import AppLayout from "@/layouts/app-layout";
import { can } from "@/lib/can";
import type { BreadcrumbItem } from "@/types";
import type { AnggotaKoperasiComponentProps } from "@/types/anggota-koperasi";

const breadcrumbs: BreadcrumbItem[] = [{ title: "Anggota Koperasi", href: route("anggota-koperasi.index") }];

export default function AnggotaKoperasiIndex({ anggota, filters }: AnggotaKoperasiComponentProps) {
    const { sorting, onSortingChange, pagination, onPaginationChange, searchQuery, handleSearchChange } = useAnggotaKoperasiPage({
        currentPage: anggota.meta.current_page,
        perPage: anggota.meta.per_page,
        filters,
    });

    const columns = useMemo<ColumnDef<AnggotaKoperasiComponentProps["anggota"]["data"][number]>[]>(
        () => [
            {
                id: "no",
                header: "No",
                cell: ({ row }) => {
                    const from = anggota.meta.from ?? 0;
                    return from + row.index;
                },
                enableSorting: false,
            },
            {
                header: "Nama",
                accessorKey: "nama",
            },
            {
                header: "NIK",
                accessorKey: "nik",
            },
            {
                header: "Bidang",
                accessorKey: "bidang",
            },
            {
                header: "No. WhatsApp",
                accessorKey: "nowa",
            },
            {
                header: "Actions",
                cell: ({ row }) => {
                    const item = row.original;
                    return (
                        <ButtonGroup>
                            {can("anggota-koperasi.update") && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="outline" size="icon" asChild>
                                                <Link href={route("anggota-koperasi.edit", item.id)}>
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

                            {can("anggota-koperasi.delete") && (
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
                                            <AlertDialogDescription>Data anggota koperasi ini akan dihapus.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Batal</AlertDialogCancel>
                                            <AlertDialogAction
                                                className="bg-red-700 text-amber-50 hover:bg-red-800 hover:text-white transition-colors duration-200"
                                                onClick={() =>
                                                    router.delete(route("anggota-koperasi.destroy", item.id), {
                                                        onSuccess: () => {
                                                            toast.success("Anggota koperasi berhasil dihapus!", {
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
        [anggota.meta.from],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Anggota Koperasi" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="w-full border-primary/10 shadow-lg">
                    <CardHeader className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                Data Anggota Koperasi
                            </CardTitle>
                            <CardDescription className="mt-1">
                                {anggota.meta.total} anggota koperasi ditemukan
                            </CardDescription>
                        </div>
                        {can("anggota-koperasi.create") && (
                            <div className="flex gap-2">
                                <Button variant="default" size="sm" asChild>
                                    <Link href={route("anggota-koperasi.create")} className="flex items-center gap-2">
                                        <Plus className="h-4 w-4" />
                                        <span>Tambah Anggota</span>
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </CardHeader>

                    <CardContent className="space-y-4 pt-2">
                        <DataTable
                            columns={columns}
                            data={anggota.data}
                            sorting={sorting}
                            onSortingChange={onSortingChange}
                            pagination={pagination}
                            onPaginationChange={onPaginationChange}
                            pageCount={anggota.meta.last_page}
                            loading={false}
                            globalFilter={searchQuery}
                            onGlobalFilterChange={handleSearchChange}
                            searchPlaceholder="Cari berdasarkan nama, NIK, bidang, atau no. WA..."
                            noDataMessage="Tidak ada anggota koperasi ditemukan."
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
