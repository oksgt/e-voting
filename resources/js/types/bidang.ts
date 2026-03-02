import type { BaseFilter, Pagination } from "@/types";

export type Bidang = {
	id: number;
	nama_bidang: string;
	created_at?: string | null;
	updated_at?: string | null;
};

export interface BidangRequest extends BaseFilter {}

export interface BidangComponentProps {
	bidang: Pagination<Bidang>;
	filters: BidangRequest;
}
