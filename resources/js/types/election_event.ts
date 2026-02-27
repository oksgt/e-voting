export interface ElectionEvent {
	id: number;
	is_autorun: boolean;
	is_running: boolean;
	keyword: string;
	name: string;
	start_date: string | null;
	started_at: string | null;
	status: "pending" | "scheduled" | "running" | "finished" | "cancelled";
	finished_at: string | null;
	duration: number | null;
	created_at: string;
	updated_at: string;
}
