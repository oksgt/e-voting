import { router } from "@inertiajs/react";
import { useDebouncedCallback } from "use-debounce";
import { route } from "ziggy-js";
import { useTableControls } from "@/hooks/use-table-controls";
import type { AnggotaKoperasiRequest } from "@/types/anggota-koperasi";

interface UseAnggotaKoperasiPageOptions {
	currentPage: number;
	perPage: number;
	filters: AnggotaKoperasiRequest;
}

export function useAnggotaKoperasiPage({ currentPage, perPage, filters }: UseAnggotaKoperasiPageOptions) {
	const { sorting, onSortingChange, pagination, onPaginationChange, searchQuery, setSearchQuery } = useTableControls({
		baseUri: "anggota-koperasi.index",
		filters,
		currentPage,
		perPage,
	});

	const handleSearchChange = useDebouncedCallback((value: string) => {
		const params: Record<string, string | number> = { ...filters, page: 1 };

		if (value.trim()) {
			params.search = value.trim();
		} else {
			setSearchQuery(value);
			delete params.search;
		}

		router.get(route("anggota-koperasi.index"), params, {
			preserveState: true,
			preserveScroll: true,
			replace: true,
		});
	}, 500);

	return {
		sorting,
		onSortingChange,
		pagination,
		onPaginationChange,
		searchQuery,
		handleSearchChange,
	};
}
