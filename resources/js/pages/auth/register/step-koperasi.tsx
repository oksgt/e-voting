import type { ChangeEvent, RefObject } from "react";
import InputError from "@/components/input-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface StepKoperasiProps {
    visible: boolean;
    bidangRef: RefObject<HTMLInputElement | null>;
    nameRef: RefObject<HTMLInputElement | null>;
    bidangOptions: string[];
    anggotaOptions: string[];
    isLoading: boolean;
    isLoadingAnggota: boolean;
    onBidangChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
    errors: Record<string, string>;
}

export function StepKoperasi({
    visible,
    bidangRef,
    nameRef,
    bidangOptions,
    anggotaOptions,
    isLoading,
    isLoadingAnggota,
    onBidangChange,
    onNameChange,
    errors,
}: StepKoperasiProps) {
    return (
        <div className={cn("grid gap-6", !visible && "hidden")}>
            <div className="grid gap-2">
                <Label htmlFor="bidang">Bidang</Label>
                <Input
                    ref={bidangRef}
                    id="bidang"
                    type="search"
                    required
                    autoFocus
                    autoComplete="off"
                    name="bidang"
                    list="bidang-options"
                    placeholder="Cari atau pilih bidang"
                    onChange={onBidangChange}
                />
                <datalist id="bidang-options">
                    {bidangOptions.map((option) => (
                        <option key={option} value={option} />
                    ))}
                </datalist>
                <p className="text-xs text-muted-foreground">
                    {isLoading ? "Memuat daftar bidang..." : "Ketik untuk mencari, lalu pilih salah satu bidang dari daftar."}
                </p>
                <InputError message={errors.bidang} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="name">Nama</Label>
                <Input
                    ref={nameRef}
                    id="name"
                    type="search"
                    required

                    autoComplete="off"
                    name="name"
                    list="nama-options"
                    placeholder="Cari atau pilih nama"
                    onChange={onNameChange}
                />
                <datalist id="nama-options">
                    {anggotaOptions.map((option) => (
                        <option key={option} value={option} />
                    ))}
                </datalist>
                <p className="text-xs text-muted-foreground">
                    {isLoadingAnggota ? "Memuat daftar nama..." : "Pilih bidang terlebih dahulu, lalu cari nama dari daftar."}
                </p>
                <InputError message={errors.name} className="mt-2" />
            </div>
        </div>
    );
}
