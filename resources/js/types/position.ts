import type { BaseFilter, Pagination } from "@/types";

export interface Position {
	id: number;
	name: string;
	description: string | null;
	status: number;
	created_at?: string | null;
	updated_at?: string | null;
}

export interface PositionRequest extends BaseFilter {}

export interface PositionComponentProps {
	positions: Pagination<Position>;
	filters: PositionRequest;
}
