import { BriefcaseBusiness, CheckCircle2, PauseCircle } from "lucide-react";
import type { PositionSectionProps } from "@/components/dashboard/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dateToString } from "@/lib/utils";

export default function PositionSummaryCards({ positions, activePositions }: PositionSectionProps) {
    const activationRate = positions.total > 0 ? Math.round((positions.active / positions.total) * 100) : 0;

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-xl">Ringkasan Posisi</CardTitle>
                <CardDescription>Pantau status posisi untuk memastikan struktur pemilihan siap dipakai.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border-border/60">
                        <CardHeader className="pb-2">
                            <CardDescription>Total Posisi</CardDescription>
                            <CardTitle className="text-3xl">{positions.total}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground flex items-center gap-2 text-sm">
                            <BriefcaseBusiness className="h-4 w-4" />
                            Total posisi dalam sistem
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader className="pb-2">
                            <CardDescription>Posisi Aktif</CardDescription>
                            <CardTitle className="text-3xl">{positions.active}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4" />
                            Aktivasi saat ini {activationRate}%
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader className="pb-2">
                            <CardDescription>Posisi Nonaktif</CardDescription>
                            <CardTitle className="text-3xl">{positions.inactive}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground flex items-center gap-2 text-sm">
                            <PauseCircle className="h-4 w-4" />
                            Perlu verifikasi sebelum event
                        </CardContent>
                    </Card>
                </div>

                <div className="rounded-xl border p-4">
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <p className="text-sm font-medium">Daftar Detail Posisi Aktif</p>
                        <Badge variant="secondary">{activePositions.length} aktif</Badge>
                    </div>

                    {activePositions.length === 0 ? (
                        <p className="text-muted-foreground text-sm">Belum ada posisi aktif saat ini.</p>
                    ) : (
                        <div className="grid gap-3 lg:grid-cols-2">
                            {activePositions.map((position) => (
                                <div className="rounded-lg border p-3" key={position.id}>
                                    <div className="mb-2 flex items-center justify-between gap-2">
                                        <p className="font-medium">{position.name}</p>
                                        <Badge variant="default">Aktif</Badge>
                                    </div>
                                    <p className="text-muted-foreground mb-2 text-sm">
                                        {position.description && position.description.trim().length > 0
                                            ? position.description
                                            : "Belum ada deskripsi posisi."}
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        Update terakhir: {dateToString(position.updated_at)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
