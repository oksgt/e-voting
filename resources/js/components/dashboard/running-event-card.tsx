import { ShieldCheck } from "lucide-react";
import type { RunningEventCardProps } from "@/components/dashboard/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dateToString } from "@/lib/utils";

export default function RunningEventCard({ runningEvent }: RunningEventCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <ShieldCheck className="h-5 w-5" />
                    Event Berjalan
                </CardTitle>
                <CardDescription>Status event aktif untuk proses pemilihan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                {runningEvent ? (
                    <>
                        <div>
                            <p className="text-muted-foreground">Nama Event</p>
                            <p className="font-medium">{runningEvent.name}</p>
                        </div>
                        <div className="grid gap-2">
                            <div className="rounded-lg border p-3">
                                <p className="text-muted-foreground text-xs">Mulai</p>
                                <p className="font-medium">{dateToString(runningEvent.started_at)}</p>
                            </div>
                            <div className="rounded-lg border p-3">
                                <p className="text-muted-foreground text-xs">Selesai</p>
                                <p className="font-medium">{dateToString(runningEvent.finished_at)}</p>
                            </div>
                        </div>
                        <Badge className="w-fit" variant="default">
                            Status: {runningEvent.status}
                        </Badge>
                    </>
                ) : (
                    <p className="text-muted-foreground">Belum ada event yang sedang berjalan.</p>
                )}
            </CardContent>
        </Card>
    );
}
