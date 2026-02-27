import { router } from "@inertiajs/react";
import type { PaginationState, SortingState } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { route } from "ziggy-js";
import type { BaseFilter } from "@/types";

interface UseTableControlsOptions {
	/** Nama route (misal: 'voters.index') */
	baseUri: string;
	/** Filter yang aktif (dari server), termasuk sort_by, sort_direction, search, dll */
	filters: BaseFilter;
	/** Halaman aktif (1-based) */
	currentPage: number;
	/** Jumlah data per halaman */
	perPage: number;
}

export const useTableControls = ({ baseUri, filters, currentPage, perPage }: UseTableControlsOptions) => {
	// State lokal untuk sorting – diinisialisasi dari props
	const [sorting, setSorting] = useState<SortingState>(() => {
		if (filters?.sort_by) {
			return [{ id: filters.sort_by, desc: filters.sort_direction === "desc" }];
		}
		return [];
	});

	// State lokal untuk pagination – diinisialisasi dari props
	const [pagination, setPagination] = useState<PaginationState>(() => ({
		pageIndex: currentPage - 1,
		pageSize: perPage,
	}));

	// Sinkronisasi sorting jika props berubah (misal karena back/forward)
	useEffect(() => {
		setSorting(() => {
			if (filters?.sort_by) {
				return [{ id: filters.sort_by, desc: filters.sort_direction === "desc" }];
			}
			return [];
		});
	}, [filters?.sort_by, filters?.sort_direction]);

	// Sinkronisasi pagination jika props berubah
	useEffect(() => {
		setPagination({
			pageIndex: currentPage - 1,
			pageSize: perPage,
		});
	}, [currentPage, perPage]);

	const [searchQuery, setSearchQuery] = useState(() => filters.search || "");

	// Handler perubahan sorting
	const handleSortingChange = useCallback(
		(updater: SortingState | ((old: SortingState) => SortingState)) => {
			const newSorting = typeof updater === "function" ? updater(sorting) : updater;
			setSorting(newSorting);

			const params: Record<string, string | number> = {
				...filters,
				page: 1, // reset ke halaman pertama
			};

			if (newSorting.length > 0) {
				params.sort_by = newSorting[0].id;
				params.sort_direction = newSorting[0].desc ? "desc" : "asc";
			} else {
				delete params.sort_by;
				delete params.sort_direction;
			}

			if (searchQuery.trim()) {
				params.search = searchQuery.trim();
			} else {
				delete params.search;
			}

			router.get(route(baseUri), params, {
				preserveState: true,
				preserveScroll: true,
				replace: true,
			});
		},
		[baseUri, filters, searchQuery, sorting], // sorting dibutuhkan untuk functional update
	);

	// Handler perubahan pagination
	const handlePaginationChange = useCallback(
		(updater: PaginationState | ((old: PaginationState) => PaginationState)) => {
			const newPagination = typeof updater === "function" ? updater(pagination) : updater;
			setPagination(newPagination);

			const params: Record<string, string | number> = {
				...filters,
				page: newPagination.pageIndex + 1,
			};

			if (sorting.length > 0) {
				params.sort_by = sorting[0].id;
				params.sort_direction = sorting[0].desc ? "desc" : "asc";
			}

			if (searchQuery.trim()) {
				params.search = searchQuery.trim();
			} else {
				delete params.search;
			}

			router.get(route(baseUri), params, {
				preserveState: true,
				preserveScroll: true,
				replace: true,
			});
		},
		[baseUri, filters, sorting, searchQuery, pagination],
	);

	return {
		sorting,
		onSortingChange: handleSortingChange,
		pagination,
		onPaginationChange: handlePaginationChange,
		searchQuery,
		setSearchQuery,
	};
};
