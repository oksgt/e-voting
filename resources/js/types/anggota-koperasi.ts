import type { BaseFilter, Pagination } from "@/types";

export type AnggotaKoperasi = {
	id: number;
	nama: string;
	nik: string;
	bidang: string;
	nowa: string;
	created_at: string | null;
	updated_at: string | null;
};

export interface AnggotaKoperasiRequest extends BaseFilter {}

export interface AnggotaKoperasiComponentProps {
	anggota: Pagination<AnggotaKoperasi>;
	filters: AnggotaKoperasiRequest;
}
