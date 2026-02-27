import { Form, Head } from "@inertiajs/react";
import { IdCard, ShieldCheck } from "lucide-react";
import InputError from "@/components/input-error";
import TextLink from "@/components/text-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import AuthLayout from "@/layouts/auth-layout";
import { BIDANG_OPTIONS } from "@/lib/constants";
import { login } from "@/routes";
import { store } from "@/routes/register";

export default function Register() {
    return (
        <AuthLayout title="Register Voter" description="Lengkapi data untuk membuat akun voter baru">
            <Head title="Register" />
            <Form {...store.form()} resetOnSuccess={["password"]} disableWhileProcessing className="flex flex-col gap-6">
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nama</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Full name"
                                />
                                <p className="text-xs text-muted-foreground">Gunakan nama lengkap sesuai identitas.</p>
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="nik">NIK</Label>
                                <div className="relative">
                                    <IdCard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
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
                                <Label htmlFor="bidang">Bidang</Label>
                                <Select name="bidang" required>
                                    <SelectTrigger>
                                        <SelectValue id="bidang" placeholder="Pilih bidang" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Bidang</SelectLabel>
                                            {BIDANG_OPTIONS.map((option) => (
                                                <SelectItem key={option} value={option}>
                                                    {option}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">Contoh: IT, Keuangan, Operasional, atau divisi lainnya.</p>
                                <InputError message={errors.bidang} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone_number">Nomor Whatsapp</Label>
                                <Input
                                    id="phone_number"
                                    type="tel"
                                    required
                                    autoComplete="tel"
                                    name="phone_number"
                                    placeholder="Contoh: 628123456789"
                                />
                                <p className="text-xs text-muted-foreground">Gunakan format internasional yang aktif di WhatsApp.</p>
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

                            <Button type="submit" className="mt-2 w-full" data-test="register-user-button">
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
