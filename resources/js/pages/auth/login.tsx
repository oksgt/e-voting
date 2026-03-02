import { Form, Head } from "@inertiajs/react";
import { BarChart3, Eye, EyeOff, KeyRound, ShieldCheck, UserRound, UsersRound } from "lucide-react";
import { useState } from "react";
import InputError from "@/components/input-error";
import TextLink from "@/components/text-link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import AuthLayout from "@/layouts/auth-layout";
import { register } from "@/routes";
import { store } from "@/routes/login";
import { request } from "@/routes/password";

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default function Login({ status, canResetPassword, canRegister }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <AuthLayout
            title="Masuk ke Akun Anda"
            description="Akses cepat ke pemilihan koperasi, hasil transparan, dan data tersinkron"
        >
            <Head title="Masuk" />

            {status && (
                <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400">
                    {status}
                </div>
            )}

            <Form
                {...store.form()}
                resetOnSuccess={["password"]}
                transform={(data) => {
                    const rawIdentifier = String(data.email ?? "").trim();
                    const normalizedEmail = isValidEmail(rawIdentifier) ? rawIdentifier : `${rawIdentifier}@example.com`;

                    return {
                        ...data,
                        email: normalizedEmail.toLowerCase(),
                    };
                }}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-4 text-sm shadow-sm dark:border-emerald-900/60 dark:from-emerald-950/50 dark:via-background dark:to-amber-950/40">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                                        <UsersRound className="h-4 w-4" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold text-foreground">E-Voting Koperasi</p>
                                        <p className="text-xs text-muted-foreground">
                                            Kelola pemilihan, verifikasi suara, dan pantau hasil secara real-time.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 grid gap-3 text-xs text-muted-foreground">
                                    <div className="flex items-start gap-2">
                                        <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                        <span>Transparan dan terverifikasi, setiap suara tercatat dengan jelas.</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <BarChart3 className="mt-0.5 h-4 w-4 text-amber-600 dark:text-amber-400" />
                                        <span>Hasil pemilihan tampil ringkas, siap dipantau oleh pengurus.</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <UserRound className="mt-0.5 h-4 w-4 text-sky-600 dark:text-sky-400" />
                                        <span>Akses aman menggunakan NIK atau username terdaftar.</span>
                                    </div>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Username / NIK</Label>
                                <div className="relative">
                                    <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="text"
                                        name="email"
                                        required
                                        autoFocus
                                        autoComplete="username"
                                        placeholder="Masukkan username atau NIK"
                                        className="pl-9"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Kata Sandi</Label>
                                    {canResetPassword && (
                                        <TextLink href={request()} className="ml-auto text-sm">
                                            Lupa kata sandi?
                                        </TextLink>
                                    )}
                                </div>
                                <div className="relative">
                                    <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        required
                                        autoComplete="current-password"
                                        placeholder="Masukkan kata sandi"
                                        className="pl-9 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                                        tabIndex={-1}
                                        aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox id="remember" name="remember" />
                                <Label htmlFor="remember">Ingat saya</Label>
                            </div>

                            <Button type="submit" className="mt-2 w-full" disabled={processing} data-test="login-button">
                                {processing && <Spinner />}
                                Masuk
                            </Button>
                        </div>

                        {canRegister && (
                            <div className="text-center text-sm text-muted-foreground">
                                Belum punya akun?{" "}
                                <TextLink href={register()}>Daftar sekarang</TextLink>
                            </div>
                        )}
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
