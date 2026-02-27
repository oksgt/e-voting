import { BriefcaseBusiness, CheckCircle2, PauseCircle } from "lucide-react";
import type { PositionSectionProps } from "@/components/dashboard/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PositionSummaryCards({ positions }: PositionSectionProps) {
    const activationRate = positions.total > 0 ? Math.round((positions.active / positions.total) * 100) : 0;

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-xl">Ringkasan Posisi</CardTitle>
                <CardDescription>Pantau status posisi untuk memastikan struktur pemilihan siap dipakai.</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
        </Card>
    );
}
