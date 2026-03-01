import { usePage } from "@inertiajs/react";
import axios from "axios";
import { CheckCircle2, CheckCircle2Icon, UserIcon, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import type { SharedData } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";

export function FormTahap1({ event }: any) {
    const [positions, setPositions] = useState<any[]>([]);
    const [searchMap, setSearchMap] = useState<Record<number, string>>({});
    const [voterMap, setVoterMap] = useState<Record<number, any[]>>({});
    const [selectedVoter, setSelectedVoter] = useState<Record<number, any>>({});
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const { auth } = usePage<SharedData>().props;
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [openAlertSubmit, setOpenAlertSubmit] = useState(false);
    const [dialogContent, setDialogContent] = useState(null);
    const [participation, setParticipation] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkParticipation = async () => {
            try {
                const res = await axios.post("/api/election-events/check-participation", {
                    event_id: event.id,
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
                        axios.get("/api/election-events/job-positions").then((res) => {
                            if (res.data.success) {
                                setPositions(res.data.data);
                            }
                        });
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
    }, [event.id, auth.user.id]);

    // const fetchVoters = (posId: number, search: string) => {
    //     if (search.length > 0) {
    //         axios
    //             .get("/api/voters", { params: { search } })
    //             .then((res) => {
    //                 if (res.data.success) {
    //                     setVoterMap((prev) => ({ ...prev, [posId]: res.data.data }));
    //                 } else {
    //                     setVoterMap((prev) => ({ ...prev, [posId]: [] }));
    //                 }
    //             })
    //             .catch(() => setVoterMap((prev) => ({ ...prev, [posId]: [] })));
    //     } else {
    //         setVoterMap((prev) => ({ ...prev, [posId]: [] }));
    //     }
    // };

    const fetchVoters = (posId: number, search: string) => {
        if (search.length > 0) {
            axios
                .get("/api/voters", { params: { search } })
                .then((res) => {
                    if (res.data.success) {
                        // filter out voters yang sudah dipilih di posisi lain
                        const chosenIds = Object.values(selectedVoter).map((v) => v?.id);
                        const filtered = res.data.data.filter(
                            (v: any) => !chosenIds.includes(v.id)
                        );

                        setVoterMap((prev) => ({ ...prev, [posId]: filtered }));
                    } else {
                        setVoterMap((prev) => ({ ...prev, [posId]: [] }));
                    }
                })
                .catch(() =>
                    setVoterMap((prev) => ({ ...prev, [posId]: [] }))
                );
        } else {
            setVoterMap((prev) => ({ ...prev, [posId]: [] }));
        }
    };

    // susun object siap kirim
    // const payload = {
    //     event_id: event.id,
    //     user_id: auth.user.id,
    //     positions: Object.entries(selectedVoter).map(([posId, voter]) => ({
    //         position_id: Number(posId),
    //         voted_by: voter.id,
    //     })),
    // };

    const payload = {
        event_id: event.id,
        voted_by: auth.user.id,
        positions: Object.entries(selectedVoter).map(([posId, voter]) => ({
            position_id: Number(posId),
            user_id: voter.id,
        })),
    };

    const handleSubmit = async () => {
        // cek posisi kosong
        const emptyPositions = positions.filter((pos) => !selectedVoter[pos.id]);

        if (emptyPositions.length > 0) {
            setErrorMessage(
                <div className="space-y-2">
                    <span className="text-neutral-700 dark:text-neutral-300 font-medium">Masih ada posisi yang belum diisi:</span>

                    <ul className="list-disc list-inside text-neutral-700 dark:text-neutral-300 text-sm space-y-1">
                        {emptyPositions.map((p) => (
                            <li key={p.id} className="font-semibold">
                                {p.name}
                            </li>
                        ))}
                    </ul>
                </div>,
            );
            setErrorOpen(true);
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post("/api/election-event-logs", payload);
            if (res.data.success) {
                setDialogContent({
                    type: "success",
                    title: "Sukses",
                    message: "Data berhasil dikirim.",
                });
                setOpenAlertSubmit(true);
                setParticipation(true);
            } else {
                setDialogContent({
                    type: "error",
                    title: "Gagal",
                    message: res.data.message,
                });
                setOpenAlertSubmit(true);
                setLoading(false);
            }
        } catch (err) {
            console.error("Error kirim payload:", err);
            setDialogContent({
                type: "error",
                title: "Error",
                message: "Terjadi kesalahan saat mengirim data. " + err,
            });
            setOpenAlertSubmit(true);
            setLoading(false);
        }
    };

    const ucwords = (str: string) => {
        return str
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase())
    }

    return (
        <>
            <div className="flex w-full flex-col gap-6">
                {!participation && positions.length > 0 ? (
                    positions.map((pos) => (
                        <Item key={pos.id} variant="outline" size="sm" className="bg-neutral-50 dark:bg-neutral-900">
                            <ItemContent>
                                <ItemTitle>
                                    Posisi: <h2 className="font-bold">{pos.name}</h2>
                                </ItemTitle>

                                <div className="mt-2">
                                    <p className="mb-2 text-sm text-neutral-600 dark:text-neutral-400">
                                        Cari anggota untuk dicalonkan pada posisi ini
                                    </p>

                                    <Combobox
                                        items={(voterMap[pos.id] || []).map((v) => ({
                                            label: ucwords(v.nama),
                                            value: v.id,
                                        }))}
                                        onValueChange={(val) => {
                                            const voter = (voterMap[pos.id] || []).find((v) => v.id === val);

                                            if (voter) {
                                                const alreadyChosen = Object.entries(selectedVoter).some(
                                                    ([otherPosId, chosen]) => Number(otherPosId) !== pos.id && chosen?.id === voter.id,
                                                );

                                                if (alreadyChosen) {
                                                    setAlertMessage(
                                                        <span>
                                                            Anggota <strong>{voter.nama}</strong> sudah dicalonkan di posisi lain!
                                                        </span>,
                                                    );
                                                    setAlertOpen(true);
                                                    return;
                                                }

                                                setSelectedVoter((prev) => ({
                                                    ...prev,
                                                    [pos.id]: voter,
                                                }));
                                            }
                                        }}
                                    >
                                        <ComboboxInput
                                            placeholder="Pilih Anggota"
                                            value={searchMap[pos.id] || ""}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setSearchMap((prev) => ({ ...prev, [pos.id]: val }));
                                                fetchVoters(pos.id, val);
                                            }}
                                            onFocus={() => {
                                                if (!(searchMap[pos.id] && searchMap[pos.id].length > 0)) {
                                                    axios.get("/api/voters").then((res) => {
                                                        if (res.data.success) {
                                                            const chosenIds = Object.values(selectedVoter).map((v) => v?.id);
                                                            const filtered = res.data.data.filter(
                                                                (v: any) => !chosenIds.includes(v.id)
                                                            );

                                                            setVoterMap((prev) => ({
                                                                ...prev,
                                                                [pos.id]: filtered,
                                                            }));
                                                        }
                                                    });
                                                }
                                            }}
                                        />
                                        <ComboboxContent>
                                            <ComboboxEmpty>Tidak ada data</ComboboxEmpty>
                                            <ComboboxList>
                                                {(item) => (
                                                    <ComboboxItem key={item.value} value={item.value}>
                                                        {item.label}
                                                    </ComboboxItem>
                                                )}
                                            </ComboboxList>
                                        </ComboboxContent>
                                    </Combobox>

                                    {selectedVoter[pos.id] && (
                                        <p className="mt-2 text-sm text-blue-600">
                                            Pilihan Anda: <strong>{ucwords(selectedVoter[pos.id].nama)}</strong>
                                        </p>
                                    )}
                                </div>
                            </ItemContent>
                        </Item>
                    ))
                ) : (
                    <>
                        {participation ? (
                            <Alert className="w-full border border-green-400 bg-green-50 text-green-700">
                                <CheckCircle2Icon className="h-5 w-5 text-green-500" />
                                <AlertTitle className="font-semibold">Terima kasih</AlertTitle>
                                <AlertDescription>Anda telah berpartisipasi dalam tahap ini</AlertDescription>
                            </Alert>
                        ) : (
                            <>
                                <Item variant="outline" size="sm">
                                    <ItemMedia variant="icon">
                                        <UserIcon className="h-5 w-5 text-neutral-500" />
                                    </ItemMedia>
                                    <ItemContent>
                                        <ItemTitle className="font-medium">Posisi belum tersedia</ItemTitle>
                                        <ItemDescription className="text-neutral-600">Data tidak ditemukan</ItemDescription>
                                    </ItemContent>
                                </Item>
                            </>
                        )}
                    </>
                )}
            </div>

            {/* Tombol submit dengan konfirmasi */}
            {!participation ? (
                <div className="mt-4 flex justify-center mb-4">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size="lg" disabled={loading}>
                                {loading ? "Sedang mengirim data" : "Kirim Pilihan"}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Konfirmasi</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Apakah Anda yakin ingin mengirim pilihan ini?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
                                <AlertDialogAction onClick={handleSubmit} disabled={loading}>
                                    OK
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            ) : null}

            {/* AlertDialog shadcn */}
            <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Peringatan</AlertDialogTitle>
                        <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setAlertOpen(false)}>OK</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={errorOpen} onOpenChange={setErrorOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Peringatan</AlertDialogTitle>
                        <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setErrorOpen(false)}>OK</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

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
        </>
    );
}
