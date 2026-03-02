import InputError from "@/components/input-error";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sentenceCaseWithTitle } from "@/lib/string";
import { cn } from "@/lib/utils";

interface StepKoperasiProps {
    visible: boolean;
    bidangOptions: string[];
    anggotaOptions: string[];
    isLoading: boolean;
    isLoadingAnggota: boolean;
    onBidangChange: (value: string) => void;
    onNameChange: (value: string) => void;
    errors: Record<string, string>;
}

export function StepKoperasi({
    visible,
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
                <Select onValueChange={onBidangChange} name="bidang" required>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Bidang" autoFocus />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {bidangOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                    {isLoading ? "Memuat daftar bidang..." : "Ketik untuk mencari, lalu pilih salah satu bidang dari daftar."}
                </p>
                <InputError message={errors.bidang} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="name">Nama</Label>
                <Select onValueChange={onNameChange} name="name" required>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Nama" autoFocus />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {anggotaOptions.map((option) => (
                                <SelectItem key={option} value={String(option)}>
                                    {sentenceCaseWithTitle(option)}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                    {isLoadingAnggota ? "Memuat daftar nama..." : "Pilih bidang terlebih dahulu, lalu cari nama dari daftar."}
                </p>
                <InputError message={errors.name} className="mt-2" />
            </div>
        </div>
    );
}
