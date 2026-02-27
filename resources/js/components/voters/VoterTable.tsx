import { Link } from "@inertiajs/react";
import type { ColumnDef, OnChangeFn, PaginationState, SortingState } from "@tanstack/react-table";
import { BadgeCheck, LucideUserPlus, Users } from "lucide-react";
import { useMemo } from "react";
import { route } from "ziggy-js";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { can } from "@/lib/can";
import { STATUS_CONFIG } from "@/lib/constants";
import type { Pagination, User } from "@/types";
import type { VoterStatusCounts } from "@/types/voter";
import ImportDialog from "./ImportDialog";
import TableAction from "./TableAction";

interface VoterTableProps {
    users: Pagination<User>;
    authUserId: number;
    csrfToken: string;
    statusCounts: VoterStatusCounts;
    activeStatus: string | null;
    onStatusFilterClear: () => void;
    sorting: SortingState;
    onSortingChange: OnChangeFn<SortingState>;
    pagination: PaginationState;
    onPaginationChange: OnChangeFn<PaginationState>;
    searchQuery: string;
    onSearchChange: (value: string) => void;
}

export default function VoterTable({
    users,
    authUserId,
    csrfToken,
    statusCounts,
    activeStatus,
    onStatusFilterClear,
    sorting,
    onSortingChange,
    pagination,
    onPaginationChange,
    searchQuery,
    onSearchChange,
}: VoterTableProps) {
    const columns = useMemo<ColumnDef<User>[]>(
        () => [
            {
                id: "no",
                header: "No",
                cell: ({ row }) => {
                    const from = users.meta.from ?? 0;
                    return from + row.index;
                },
                enableSorting: false,
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: ({ row }) => {
                    const status = row.original.status;
                    const config = STATUS_CONFIG[status] || { text: status, className: "bg-gray-100 text-gray-800" };
                    return (
                        <Badge variant="outline" className={config.className}>
                            {config.text}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: "bidang",
                header: "Bidang",
                cell: ({ row }) => row.original.bidang ?? "-",
            },
            {
                accessorKey: "name",
                header: "Name",
            },
            {
                accessorKey: "nik",
                header: "NIK",
            },
            {
                header: "Phone Number",
                cell: ({ row }) => {
                    const phone = row.original.phone_number ?? "-";
                    const active = Number(row.original.whatsapp_active);

                    return (
                        <div className="flex flex-col">
                            <span>{phone}</span>
                            {active === 1 ? (
                                <Badge className="bg-green-500 text-white mt-1 flex items-center gap-1">
                                    <BadgeCheck className="h-3 w-3" />
                                    Registered on WA
                                </Badge>
                            ) : (
                                <span className="text-gray-500 text-sm mt-1">Not registered</span>
                            )}
                        </div>
                    );
                },
            },
            {
                accessorKey: "email",
                header: "Email",
            },
            {
                id: "actions",
                header: "Action",
                cell: ({ row }) => <TableAction user={row.original} authUserId={authUserId} voterId={row.original.id} />,
            },
        ],
        [users.meta.from, authUserId],
    );

    return (
        <Card className="border-primary/10 shadow-lg">
            <CardHeader className="flex items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Data Voter
                        {activeStatus && (
                            <Badge variant="outline" className={STATUS_CONFIG[activeStatus]?.className ?? ""}>
                                {activeStatus}
                            </Badge>
                        )}
                    </CardTitle>
                    <CardDescription className="mt-1">
                        {activeStatus
                            ? `Showing ${activeStatus} voters · ${users.meta.total} result${users.meta.total !== 1 ? "s" : ""}`
                            : `${statusCounts.total} registered voter${statusCounts.total !== 1 ? "s" : ""}`}
                    </CardDescription>
                </div>
                {can("voters.register") && (
                    <div className="flex gap-2">
                        <Button variant="default" size="sm" asChild>
                            <Link href={route("voters.create")} className="flex items-center gap-2">
                                <LucideUserPlus className="h-4 w-4" />
                                <span>Add New Voter</span>
                            </Link>
                        </Button>
                        <ImportDialog csrfToken={csrfToken} />
                    </div>
                )}
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
                {activeStatus && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Showing voters with status:</span>
                        <Badge variant="outline" className={STATUS_CONFIG[activeStatus]?.className ?? ""}>
                            {activeStatus}
                        </Badge>
                        <button
                            type="button"
                            onClick={onStatusFilterClear}
                            className="ml-1 text-xs underline hover:text-foreground"
                        >
                            Clear filter
                        </button>
                    </div>
                )}
                <DataTable
                    columns={columns}
                    data={users.data}
                    sorting={sorting}
                    onSortingChange={onSortingChange}
                    pagination={pagination}
                    onPaginationChange={onPaginationChange}
                    pageCount={users.meta.last_page}
                    loading={false}
                    globalFilter={searchQuery}
                    onGlobalFilterChange={onSearchChange}
                    searchPlaceholder="Search by name, bidang, or phone number..."
                />
            </CardContent>
        </Card>
    );
}
