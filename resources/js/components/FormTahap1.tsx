import {
    Item,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item";
import { UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"

import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox"


import { SearchIcon } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { usePage } from "@inertiajs/react";
import { SharedData } from "@/types";
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

    console.log('event', event.id);
    console.log('auth', auth.user.id);

    useEffect(() => {
        axios.get("/api/election-events/job-positions").then((res) => {
            if (res.data.success) {
                setPositions(res.data.data);
            }
        });
    }, []);

    const fetchVoters = (posId: number, search: string) => {
        if (search.length > 0) {
            axios
                .get("/api/voters", { params: { search } })
                .then((res) => {
                    if (res.data.success) {
                        setVoterMap((prev) => ({ ...prev, [posId]: res.data.data }));
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
    const payload = {
        event_id: event.id,
        user_id: auth.user.id,
        positions: Object.entries(selectedVoter).map(([posId, voter]) => ({
            position_id: Number(posId),
            voted_by: voter.id,
        })),
    };

    const handleSubmit = async () => {
        // cek posisi kosong
        const emptyPositions = positions.filter((pos) => !selectedVoter[pos.id]);

        if (emptyPositions.length > 0) {
            setErrorMessage(
                <span>
                    Masih ada posisi yang belum diisi:{" "}
                    <strong>{emptyPositions.map((p) => p.name).join(", ")}</strong>
                </span>
            );
            setErrorOpen(true);
            return;
        }

        try {
            const res = await axios.post("/api/election-event-logs", payload);
            if (res.data.success) {
                console.log("Data berhasil dikirim:", res.data);
            } else {
                console.error("Gagal kirim:", res.data);
            }
        } catch (err) {
            console.error("Error kirim payload:", err);
        }
    };

    console.log("Payload ready to send:", payload);

    return (
        <>
            <div className="flex w-full max-w-md flex-col gap-6">
                {positions.length > 0 ? (
                    positions.map((pos) => (
                        <Item
                            key={pos.id}
                            variant="outline"
                            size="sm"
                            className="bg-neutral-50 dark:bg-neutral-900"
                        >
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
                                            label: v.name,
                                            value: v.id,
                                        }))}
                                        onValueChange={(val) => {
                                            const voter = (voterMap[pos.id] || []).find(
                                                (v) => v.id === val
                                            );

                                            if (voter) {
                                                const alreadyChosen = Object.entries(selectedVoter).some(
                                                    ([otherPosId, chosen]) =>
                                                        Number(otherPosId) !== pos.id &&
                                                        chosen?.id === voter.id
                                                );

                                                if (alreadyChosen) {
                                                    setAlertMessage(
                                                        <span>
                                                            Anggota <strong>{voter.name}</strong> sudah dicalonkan di posisi lain!
                                                        </span>
                                                    );
                                                    setAlertOpen(true);
                                                    return;
                                                }

                                                setSelectedVoter((prev) => ({
                                                    ...prev,
                                                    [pos.id]: voter,
                                                }));
                                                console.log(
                                                    `Posisi ${pos.name} (${pos.id}) memilih voter:`,
                                                    voter
                                                );
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
                                                if (
                                                    !(searchMap[pos.id] && searchMap[pos.id].length > 0)
                                                ) {
                                                    axios.get("/api/voters").then((res) => {
                                                        if (res.data.success) {
                                                            setVoterMap((prev) => ({
                                                                ...prev,
                                                                [pos.id]: res.data.data,
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
                                            Pilihan Anda:{" "}
                                            <strong>{selectedVoter[pos.id].name}</strong>
                                        </p>
                                    )}
                                </div>
                            </ItemContent>
                        </Item>
                    ))
                ) : (
                    <Item variant="outline" size="sm">
                        <ItemMedia variant="icon">
                            <UserIcon />
                        </ItemMedia>
                        <ItemContent>
                            <ItemTitle>Posisi belum tersedia</ItemTitle>
                            <ItemDescription>Data tidak ditemukan</ItemDescription>
                        </ItemContent>
                    </Item>
                )}
            </div>

            {/* Tombol submit dengan konfirmasi */}
            <div className="mt-4 flex justify-center mb-4">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button size="lg">Kirim Pilihan</Button>
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
                            <AlertDialogAction onClick={handleSubmit}>
                                OK
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>


            {/* AlertDialog shadcn */}
            <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Peringatan</AlertDialogTitle>
                        <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setAlertOpen(false)}>
                            OK
                        </AlertDialogAction>
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
                        <AlertDialogAction onClick={() => setErrorOpen(false)}>
                            OK
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

