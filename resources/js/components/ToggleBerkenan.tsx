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

interface Candidate {
    id: number;
    name: string;
    persentase: number;
    total_votes: number;
    event_id: number;
    position_id: number;
    filled_rejections?: number;
}

interface ToggleProps {
    data: Candidate;
    apiUrl: string;
}

export default function ToggleBerkenan({ data }: ToggleProps) {
    // jika filled_rejections == 0 → set awal ke false
    const [isBerkenan, setIsBerkenan] = useState(data.filled_rejections == 0);
    const [openDialog, setOpenDialog] = useState(false);
    const [reason, setReason] = useState("");

    useEffect(() => {
        setIsBerkenan(data.filled_rejections == 0);
    }, [data.filled_rejections]);

    const handleToggle = async () => {
        const newValue = !isBerkenan;
        setIsBerkenan(newValue);

        if (!newValue) {
            // jika tidak berkenan, buka dialog
            setOpenDialog(true);
        } else {
            // jika kembali ke berkenan → panggil removeRejection
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
            }
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
        <div className="flex items-center space-x-2">
            <button
                onClick={handleToggle}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 ease-in-out ${isBerkenan ? "bg-green-500" : "bg-gray-300"
                    }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300 ease-in-out ${isBerkenan ? "translate-x-4" : "translate-x-1"
                        }`}
                />
            </button>
            <span className="text-gray-700 text-sm font-medium">
                {isBerkenan ? "Berkenan" : "Tidak berkenan"}
            </span>

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
        </div>
    );
}
