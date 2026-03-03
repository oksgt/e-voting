import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import type { TopCandidate } from "@/types/top-two-per-position";

interface ToggleProps {
    data: TopCandidate;
}

export default function ToggleBerkenan({ data }: ToggleProps) {
    const [isBerkenan, setIsBerkenan] = useState(data.filled_rejections == 0);
    const [openDialog, setOpenDialog] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false); // NEW: dialog konfirmasi
    const [reason, setReason] = useState("");

    useEffect(() => {
        setIsBerkenan(data.filled_rejections == 0);
    }, [data.filled_rejections]);

    const handleToggle = () => {
        const newValue = !isBerkenan;
        setIsBerkenan(newValue);

        if (!newValue) {
            // jika tidak berkenan, buka dialog alasan
            setOpenDialog(true);
        } else {
            // jika kembali ke berkenan → buka dialog konfirmasi dulu
            setOpenConfirm(true);
        }
    };

    const handleRemoveRejection = async () => {
        try {
            const response = await fetch("/api/election-event-log/rejection/remove", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    event_id: data.event_id,
                    user_id: data.id,
                    position_id: data.position_id,
                }),
            });

            if (!response.ok) {
                throw new Error("Gagal menghapus rejection");
            }

            const result = await response.json();
            console.log("API response (remove):", result);

            if (result.success) {
                setIsBerkenan(true);
                toast.success("Alasan penolakan berhasil dihapus!");
            } else {
                setIsBerkenan(false);
                toast.error("Gagal menghapus alasan penolakan!");
            }
        } catch (err) {
            console.error(err);
            setIsBerkenan(false);
        } finally {
            setOpenConfirm(false);
        }
    };

    const handleSubmitReason = async () => {
        try {
            const response = await fetch("/api/election-event-log/rejection", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    event_id: data.event_id,
                    user_id: data.id,
                    position_id: data.position_id,
                    reason: reason,
                }),
            });

            if (!response.ok) {
                throw new Error("Gagal menyimpan alasan");
            }

            const result = await response.json();
            console.log("API response (reason):", result);

            if (result.success) {
                setIsBerkenan(false);
                toast.success("Alasan penolakan berhasil disimpan!");
            } else {
                setIsBerkenan(true);
                toast.error("Gagal menyimpan alasan penolakan!");
            }
        } catch (err) {
            console.error(err);
            setIsBerkenan(true);
        } finally {
            setOpenDialog(false);
            setReason("");
        }
    };

    const handleCancel = () => {
        setIsBerkenan(true);
        setOpenDialog(false);
        setReason("");
    };

    const handleDialogChange = (isOpen: boolean) => {
        if (!isOpen) {
            handleCancel();
        }
        setOpenDialog(isOpen);
    };

    return (
        <div className="flex flex-col items-start gap-1">
            <button
                onClick={handleToggle}
                className={`relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors duration-300 ease-in-out ${isBerkenan ? "bg-green-500" : "bg-gray-300"
                    }`}
            >
                <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white shadow transition-transform duration-300 ease-in-out ${isBerkenan ? "translate-x-3.5" : "translate-x-1"
                        }`}
                />
            </button>
            <span className={`text-[10px] leading-tight font-medium ${isBerkenan ? "text-green-700" : "text-red-600"}`}>
                {isBerkenan ? "Berkenan" : "Tidak"}
            </span>

            {/* Dialog alasan */}
            <Dialog open={openDialog} onOpenChange={handleDialogChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tambahkan alasan</DialogTitle>
                        <DialogDescription>
                            Silakan masukkan informasi tambahan mengapa tidak berkenan.
                        </DialogDescription>
                    </DialogHeader>
                    <Input
                        placeholder="Alasan tidak berkenan..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                    <DialogFooter>
                        <Button variant="secondary" onClick={handleCancel}>
                            Batal
                        </Button>
                        <Button onClick={handleSubmitReason}>Simpan</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog konfirmasi remove */}
            <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus alasan penolakan dan kembali ke
                            status berkenan?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setOpenConfirm(false)}>
                            Batal
                        </Button>
                        <Button onClick={handleRemoveRejection}>Ya, hapus</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
