import { useEffect, useState } from "react"
import { Check, UserCircle } from "lucide-react"
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

export function TopTwoPerPositionVoter({ eventId }: { eventId: number }) {
    const [positions, setPositions] = useState<any[]>([])
    const [selected, setSelected] = useState<Record<string, number | null>>({})
    const [unselectedPositions, setUnselectedPositions] = useState<any[]>([])
    const [showValidationDialog, setShowValidationDialog] = useState(false)
    const { auth } = usePage<SharedData>().props;

    const fetchData = () => {
        fetch(`/api/top-2-per-position/${eventId}`)
            .then((res) => res.json())
            .then((data) => {
                setPositions(data)
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

    const handleSubmit = () => {
        const unselected = positions.filter((pos: any) => !selected[pos.id])
        if (unselected.length > 0) {
            setUnselectedPositions(unselected)
            setShowValidationDialog(true)
            return
        }

        const hasilPilihan = getUserSelections()
        console.log("Pilihan user:", hasilPilihan)
        // lanjutkan kirim ke API
    }

    return (
        <Card className="w-full flex flex-col">
            <CardHeader>
                <CardTitle>Daftar Posisi & Kandidat</CardTitle>
                <CardDescription>Pilih salah satu kandidat untuk setiap posisi</CardDescription>
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
                                            <span className="text-lg font-semibold text-gray-900">{c.name}</span>
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
        </Card>
    )
}
