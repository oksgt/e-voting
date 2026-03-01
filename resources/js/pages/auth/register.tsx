import { Form, Head } from "@inertiajs/react";
import { CheckCircle2, IdCard, Loader2, ShieldCheck, XCircle } from "lucide-react";
import { useRef } from "react";
import InputError from "@/components/input-error";
import TextLink from "@/components/text-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useRegisterHook } from "@/hooks/use-register-hook";
import AuthLayout from "@/layouts/auth-layout";
import { login } from "@/routes";
import { store } from "@/routes/register";

export default function Register() {
    const {
        options: bidangOptions,
        isLoading,
        onBidangChange,
        onNowaChange,
        anggotaOptions,
        isLoadingAnggota,
        findDetailByName,
        phoneValidationStatus,
        phoneValidationMessage,
    } = useRegisterHook();
    const nikInputRef = useRef<HTMLInputElement>(null);
    const nowaInputRef = useRef<HTMLInputElement>(null);

    const handleBidangChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        onBidangChange(value);
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.value;
        const anggota = findDetailByName(name);
        let nik = "";
        let nowa = "";
        if (anggota) {
            nik = anggota?.nik;
            nowa = anggota?.nowa;
        }
        const nikValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
        const nowaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
        nikValueSetter?.call(nikInputRef.current, nik);
        nowaValueSetter?.call(nowaInputRef.current, nowa);
        nikInputRef.current?.dispatchEvent(new Event("input", { bubbles: true }));
        nowaInputRef.current?.dispatchEvent(new Event("input", { bubbles: true }));
    };

    const getValidationIcon = () => {
        switch (phoneValidationStatus) {
            case "validating":
                return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
            case "valid":
                return <CheckCircle2 className="h-4 w-4 text-green-600" />;
            case "invalid":
            case "error":
                return <XCircle className="h-4 w-4 text-red-600" />;
            default:
                return null;
        }
    };

    const isFormValid = phoneValidationStatus === "valid";

    return (
        <AuthLayout title="Register Voter" description="Lengkapi data untuk membuat akun voter baru">
            <Head title="Register" />
            <Form {...store.form()} resetOnSuccess={["password"]} disableWhileProcessing className="flex flex-col gap-6">
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="bidang">Bidang</Label>
                                <Input
                                    id="bidang"
                                    type="search"
                                    required
                                    autoComplete="off"
                                    name="bidang"
                                    list="bidang-options"
                                    placeholder="Cari atau pilih bidang"
                                    onChange={handleBidangChange}
                                />
                                <datalist id="bidang-options">
                                    {bidangOptions.map((option) => (
                                        <option key={option} value={option} />
                                    ))}
                                </datalist>
                                <p className="text-xs text-muted-foreground">
                                    {isLoading
                                        ? "Memuat daftar bidang..."
                                        : "Ketik untuk mencari, lalu pilih salah satu bidang dari daftar."}
                                </p>
                                <InputError message={errors.bidang} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">Nama</Label>
                                <Input
                                    id="name"
                                    type="search"
                                    required
                                    autoFocus
                                    autoComplete="off"
                                    name="name"
                                    list="nama-options"
                                    placeholder="Cari atau pilih nama"
                                    onChange={handleNameChange}
                                />
                                <datalist id="nama-options">
                                    {anggotaOptions.map((option) => (
                                        <option key={option} value={option} />
                                    ))}
                                </datalist>
                                <p className="text-xs text-muted-foreground">
                                    {isLoadingAnggota
                                        ? "Memuat daftar nama..."
                                        : "Pilih bidang terlebih dahulu, lalu cari nama dari daftar."}
                                </p>
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="nik">NIK</Label>
                                <div className="relative">
                                    <IdCard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        ref={nikInputRef}
                                        id="nik"
                                        type="text"
                                        required
                                        autoComplete="off"
                                        name="nik"
                                        placeholder="16 digit NIK"
                                        maxLength={16}
                                        inputMode="numeric"
                                        className="pl-9"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">NIK harus 16 digit angka dan unik.</p>
                                <InputError message={errors.nik} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone_number">Nomor Whatsapp</Label>
                                <div className="relative">
                                    <Input
                                        ref={nowaInputRef}
                                        id="phone_number"
                                        type="tel"
                                        required
                                        autoComplete="tel"
                                        name="phone_number"
                                        placeholder="Contoh: 628123456789"
                                        onChange={onNowaChange}
                                        className="pr-10"
                                    />
                                    {phoneValidationStatus !== "idle" && (
                                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                                            {getValidationIcon()}
                                        </div>
                                    )}
                                </div>
                                {phoneValidationMessage && (
                                    <p
                                        className={`text-xs ${phoneValidationStatus === "valid"
                                                ? "text-green-600"
                                                : phoneValidationStatus === "validating"
                                                    ? "text-blue-600"
                                                    : "text-red-600"
                                            }`}
                                    >
                                        {phoneValidationMessage}
                                    </p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Gunakan format internasional yang aktif di WhatsApp.
                                </p>
                                <InputError message={errors.phone_number} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Password"
                                />
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    Minimal 8 karakter untuk keamanan akun.
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                data-test="register-user-button"
                                disabled={!isFormValid || processing}
                            >
                                {processing && <Spinner />}
                                Daftar Sekarang
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Sudah punya akun? <TextLink href={login()}>Masuk di sini</TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
