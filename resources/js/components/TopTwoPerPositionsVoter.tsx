import { useEffect, useState } from "react"
import { Check, CheckCircle2, CheckCircle2Icon, UserCircle, XCircle } from "lucide-react"
import {
    Card, CardHeader, CardTitle, CardDescription,
    CardContent, CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "./ui/alert-dialog"
import { usePage } from "@inertiajs/react"
import { SharedData } from "@/types"
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export function TopTwoPerPositionVoter({ eventId }: { eventId: number }) {
    const [positions, setPositions] = useState<any[]>([])
    const [selected, setSelected] = useState<Record<string, number | null>>({})
    const [unselectedPositions, setUnselectedPositions] = useState<any[]>([])
    const [showValidationDialog, setShowValidationDialog] = useState(false)
    const { auth } = usePage<SharedData>().props;
    const [openAlertSubmit, setOpenAlertSubmit] = useState(false);
    const [dialogContent, setDialogContent] = useState(null);
    const [participation, setParticipation] = useState(null);

    useEffect(() => {
        const checkParticipation = async () => {
            try {
                const res = await axios.post("/api/election-events/check-participation", {
                    event_id: 4,
                    user_id: auth.user.id,
                });

                if (res.data.success) {
                    if (res.data.participated) {
                        setDialogContent({
                            type: "success",
                            title: "Sudah Berpartisipasi",
                            message: "Terima kasih atas partisapasi Anda dalam tahap ini",
                        });
                        setOpenAlertSubmit(true);
                    } else {
                        setOpenAlertSubmit(false);
                    }

                    setParticipation(res.data.participated);
                }
            } catch (err) {
                setDialogContent({
                    type: "error",
                    title: "Error",
                    message: "Terjadi kesalahan saat memeriksa partisipasi: " + err,
                });
                setOpenAlertSubmit(true);
            }
        };

        checkParticipation();
    }, [auth.user.id]);


    const fetchData = () => {
        fetch(`/api/top-2-per-position-tahap-2/${eventId}`)
            .then((res) => res.json())
            .then((data) => {
                setPositions(data.positions)
                const initSelected: Record<string, number | null> = {}
                data.forEach((pos: any) => {
                    initSelected[pos.id] = null
                })
                setSelected(initSelected)
            })
    }

    useEffect(() => {
        fetchData()
    }, [eventId])

    const handleSelect = (posId: string, candidateId: number) => {
        setSelected((prev) => ({
            ...prev,
            [posId]: candidateId,
        }))
    }

    const getUserSelections = () => {
        return positions.map((pos: any) => {
            const kandidatTerpilih = pos.candidates.find(
                (c: any) => c.id === selected[pos.id]
            )
            return {
                event_id: 4,
                user_id: auth.user.id,
                posId: pos.id,
                posisi: pos.position,
                kandidatId: selected[pos.id],
                kandidatNama: kandidatTerpilih?.name || null,
            }
        })
    }

    const handleSubmit = async () => {
        const unselected = positions.filter((pos: any) => !selected[pos.id])
        if (unselected.length > 0) {
            setUnselectedPositions(unselected)
            setShowValidationDialog(true)
            return
        }

        const hasilPilihan = getUserSelections()
        console.log("Pilihan user:", hasilPilihan)

        try {
            const response = await axios.post("/api/election-event-logs-tahap2", {
                event_id: 4,
                user_id: auth.user.id,
                selections: hasilPilihan.map((p) => ({
                    posId: p.posId,
                    kandidatId: p.kandidatId,
                })),
            })

            console.log("Response API:", response.data)

            // Reset state jika perlu
            setShowValidationDialog(false)
            setUnselectedPositions([])

            if (response.data.success) {
                setDialogContent({
                    type: "success",
                    title: "Sudah Berpartisipasi",
                    message: "Terima kasih atas partisapasi Anda dalam tahap ini",
                });
                setParticipation(true);
            } else {
                setDialogContent({
                    type: "error",
                    title: "Gagal",
                    message: response.data.message,
                });
            }


            setOpenAlertSubmit(true);
        } catch (error: any) {
            setDialogContent({
                type: "error",
                title: "Error",
                message: "Terjadi kesalahan saat memeriksa partisipasi: " + error,
            });
            setOpenAlertSubmit(true);
        }
    }

    const ucwords = (str: string) => {
        return str
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase())
    }


    return (
        <>
            {participation ? (
                <Alert className="max-w-md border border-green-400 bg-green-50 text-green-700">
                    <CheckCircle2Icon className="h-5 w-5 text-green-500" />
                    <div className="flex flex-col">
                        <AlertTitle className="font-semibold">Terima kasih</AlertTitle>
                        <AlertDescription>
                            Anda telah berpartisipasi dalam tahap ini
                        </AlertDescription>
                    </div>
                </Alert>
            ) : (
                <Card className="w-full flex flex-col">
                    <CardHeader>
                        <CardTitle>Pilih salah satu kandidat untuk setiap posisi</CardTitle>
                        <CardDescription></CardDescription>
                    </CardHeader>

                    <CardContent className="flex flex-col gap-3">
                        {positions.map((pos: any) => (
                            <Card key={pos.id} className="flex flex-col rounded-2xl shadow-md bg-white/80 border">
                                <CardHeader className="flex justify-center items-center pb-0">
                                    <CardTitle className="text-xl font-semibold text-gray-900 text-center">
                                        {pos.position}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-around w-full gap-4">
                                        {pos.candidates.map((c: any, idx: number) => {
                                            const isSelected = selected[pos.id] === c.id
                                            return (
                                                <div
                                                    key={c.id}
                                                    onClick={() => handleSelect(pos.id, c.id)}
                                                    className={`relative flex flex-col items-center gap-2 rounded-lg px-4 py-2 shadow-sm cursor-pointer transition
                        ${idx === 0 ? "bg-blue-50" : idx === 1 ? "bg-green-50" : "bg-gray-50"}
                        ${isSelected ? "ring-2 ring-blue-500" : ""}
                      `}
                                                >
                                                    {isSelected && (
                                                        <div className="absolute -top-2 -right-2 rounded-full border-2 border-blue-500 p-0.5 bg-blue-500">
                                                            <Check className="h-4 w-4 text-white" />
                                                        </div>
                                                    )}
                                                    <UserCircle className="h-10 w-10 text-gray-600" />
                                                    <span className="text-lg font-semibold text-gray-900">{ucwords(c.name)}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </CardContent>

                    <CardFooter className="flex justify-center">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="default">Kirim Pilihan</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Konfirmasi</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Apakah Anda yakin ingin mengirim pilihan ini?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleSubmit}>OK</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardFooter>

                    {/* AlertDialog tambahan untuk validasi */}
                    {showValidationDialog && (
                        <AlertDialog open={showValidationDialog} onOpenChange={setShowValidationDialog}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Pilihan belum lengkap</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {unselectedPositions.map((pos: any) => (
                                            <div key={pos.id}>
                                                <span className="font-bold">Anda belum memilih calon untuk posisi{" "} {pos.position}</span>
                                            </div>
                                        ))}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogAction onClick={() => setShowValidationDialog(false)}>
                                        OK
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}

                    <AlertDialog open={openAlertSubmit} onOpenChange={setOpenAlertSubmit}>
                        <AlertDialogContent className="rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 w-full max-w-sm transition-transform duration-300 ease-out flex flex-col items-center text-center">

                            {/* Header dengan ikon */}
                            <AlertDialogHeader className="flex flex-col items-center space-y-3">
                                {dialogContent?.type === "success" ? (
                                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                                ) : (
                                    <XCircle className="h-10 w-10 text-red-500" />
                                )}
                                <AlertDialogTitle className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                                    {dialogContent?.title}
                                </AlertDialogTitle>
                            </AlertDialogHeader>

                            {/* Deskripsi */}
                            <AlertDialogDescription className="text-neutral-600 dark:text-neutral-400 mt-4 text-base leading-relaxed">
                                {dialogContent?.message}
                            </AlertDialogDescription>

                            {/* Tombol Aksi */}
                            <div className="mt-6">
                                <button
                                    onClick={() => setOpenAlertSubmit(false)}
                                    className={`px-5 py-2.5 rounded-xl font-medium text-sm shadow-sm transition-colors ${dialogContent?.type === "success"
                                        ? "bg-green-500 text-white hover:bg-green-600"
                                        : "bg-red-500 text-white hover:bg-red-600"
                                        }`}
                                >
                                    Tutup
                                </button>
                            </div>
                        </AlertDialogContent>
                    </AlertDialog>
                </Card>
            )}
        </>


    )
}
