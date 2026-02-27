import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    type OnChangeFn,
    type PaginationState,
    type SortingState,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    loading?: boolean;
    onRowClick?: (row: TData) => void;
    // Global filter
    globalFilter?: string;
    onGlobalFilterChange?: (value: string) => void;
    searchPlaceholder?: string;
    // Sorting
    sorting?: SortingState;
    // using the same change function signature that tanstack expects so callers can
    // simply pass state setters (e.g. setSorting) or their own OnChangeFn.
    onSortingChange?: OnChangeFn<SortingState>;
    // Pagination
    pagination?: PaginationState;
    onPaginationChange?: OnChangeFn<PaginationState>;
    pageCount?: number; // untuk manual pagination
    // Styling
    className?: string;
    noDataMessage?: string;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    loading = false,
    onRowClick,
    globalFilter,
    onGlobalFilterChange,
    searchPlaceholder = "Search...",
    sorting,
    onSortingChange,
    pagination,
    onPaginationChange,
    pageCount,
    className,
    noDataMessage = "No data found.",
}: DataTableProps<TData, TValue>) {
    const isManualPagination = pagination !== undefined && onPaginationChange !== undefined;
    const isManualSorting = sorting !== undefined && onSortingChange !== undefined;

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter,
            pagination,
        },
        onSortingChange,
        onGlobalFilterChange,
        onPaginationChange,
        pageCount: isManualPagination ? pageCount : undefined, // for manual pagination
        manualPagination: isManualPagination,
        manualSorting: isManualSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    // Render loading skeletons
    const renderSkeletonRows = () => {
        const rowsCount = pagination?.pageSize ?? 10;
        return Array.from({ length: rowsCount }).map(() => (
            <TableRow key={crypto.randomUUID()}>
                {columns.map((col) => (
                    <TableCell key={col.id ?? crypto.randomUUID()}>
                        <Skeleton className="h-4 w-full" />
                    </TableCell>
                ))}
            </TableRow>
        ));
    };

    return (
        <div className={cn("space-y-4", className)}>
            {/* Global filter input */}
            {onGlobalFilterChange && (
                <div className="flex items-center justify-between">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                        <Input
                            placeholder={searchPlaceholder}
                            defaultValue={globalFilter ?? ""}
                            onChange={(e) => onGlobalFilterChange(e.target.value)}
                            className="pl-9 pr-9 h-9 bg-background shadow-sm"
                        />
                        {globalFilter && globalFilter.length > 0 && (
                            <button
                                type="button"
                                onClick={() => onGlobalFilterChange("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Clear search"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="rounded-lg border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-b hover:bg-transparent">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="font-semibold text-foreground/80 text-xs uppercase tracking-wide">
                                        {header.isPlaceholder ? null : (
                                            <Button
                                                variant="ghost"
                                                className={cn(
                                                    "flex items-center gap-1.5 -ml-3 h-8 text-xs uppercase tracking-wide font-semibold text-foreground/80",
                                                    header.column.getCanSort() && "cursor-pointer select-none hover:text-foreground"
                                                )}
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {{
                                                    asc: <ArrowUp className="h-4 w-4" />,
                                                    desc: <ArrowDown className="h-4 w-4" />,
                                                }[header.column.getIsSorted() as string] ?? null}
                                            </Button>
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            renderSkeletonRows()
                        ) : table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    onClick={() => onRowClick?.(row.original)}
                                    className={cn(onRowClick && "cursor-pointer hover:bg-muted/50")}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    {noDataMessage}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {isManualPagination && (
                <div className="flex items-center justify-between gap-4 py-2">
                    <p className="text-sm text-muted-foreground">
                        Showing{" "}
                        <span className="font-medium text-foreground">
                            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                        </span>
                        {" "}–{" "}
                        <span className="font-medium text-foreground">
                            {Math.min(
                                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                                pageCount ?? 0,
                            )}
                        </span>
                        {" "}of{" "}
                        <span className="font-medium text-foreground">{pageCount ?? 0}</span>
                        {" "}entries
                    </p>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            className="hidden h-8 w-8 lg:flex"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to first page</span>
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to previous page</span>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="px-2 text-sm text-muted-foreground">
                            Page {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to next page</span>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="hidden h-8 w-8 lg:flex"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to last page</span>
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
