export interface ElectionEvent {
	id: number;
	name: string;
	keyword: string;
	start_date: string | null;
	duration: number | null;
	is_autorun: boolean;
	status: "pending" | "scheduled" | "running" | "finished" | "cancelled";
	is_running: boolean;
	started_at: string | null;
	finished_at: string | null;
	created_at: string | null;
	updated_at: string | null;
	deleted_at: string | null;
}
