import { router } from "@inertiajs/react";
import { useDebouncedCallback } from "use-debounce";
import { route } from "ziggy-js";
import { useTableControls } from "@/hooks/use-table-controls";
import type { PositionRequest } from "@/types/position";

interface UsePositionPageOptions {
	currentPage: number;
	perPage: number;
	filters: PositionRequest;
}

export function usePositionPage({ currentPage, perPage, filters }: UsePositionPageOptions) {
	const { sorting, onSortingChange, pagination, onPaginationChange, searchQuery, setSearchQuery } = useTableControls({
		baseUri: "positions.index",
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

		router.get(route("positions.index"), params, {
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
