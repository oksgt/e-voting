import { Check, Eye, EyeOff, ShieldCheck } from "lucide-react";
import type { RefObject } from "react";
import InputError from "@/components/input-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PasswordValidation } from "@/hooks/use-password-validation";
import { cn } from "@/lib/utils";

interface StepKeamananAkunProps {
    visible: boolean;
    passwordRef: RefObject<HTMLInputElement | null>;
    password: string;
    confirmPassword: string;
    showPassword: boolean;
    showConfirmPassword: boolean;
    passwordValidation: PasswordValidation;
    passwordsMatch: boolean;
    onPasswordChange: (value: string) => void;
    onConfirmPasswordChange: (value: string) => void;
    togglePasswordVisibility: () => void;
    toggleConfirmPasswordVisibility: () => void;
    errors: Record<string, string>;
}

const requirements = [
    { key: "minLength" as const, label: "Minimal 8 karakter" },
    { key: "hasLowercase" as const, label: "Huruf kecil (a-z)" },
    { key: "hasUppercase" as const, label: "Huruf besar (A-Z)" },
    { key: "hasNumber" as const, label: "Angka (0-9)" },
];

export function StepKeamananAkun({
    visible,
    passwordRef,
    password,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    passwordValidation,
    passwordsMatch,
    onPasswordChange,
    onConfirmPasswordChange,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    errors,
}: StepKeamananAkunProps) {
    return (
        <div className={cn("grid gap-6", !visible && "hidden")}>
            <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                    <Input
                        ref={passwordRef}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete="new-password"
                        name="password"
                        placeholder="Password"
                        onChange={(e) => onPasswordChange(e.target.value)}
                        className="pr-10"
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                        <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">Persyaratan password:</span>
                    </div>
                    <div className="space-y-0.5 pl-6 text-xs">
                        {requirements.map((req) => (
                            <div
                                key={req.key}
                                className={cn(
                                    "flex items-center gap-1",
                                    passwordValidation.requirements[req.key] ? "text-green-600" : "text-muted-foreground",
                                )}
                            >
                                <Check className="h-3 w-3" />
                                {req.label}
                            </div>
                        ))}
                    </div>
                    {password && (
                        <div
                            className={cn(
                                "text-xs font-medium",
                                passwordValidation.status === "strong"
                                    ? "text-green-600"
                                    : passwordValidation.status === "medium"
                                        ? "text-yellow-600"
                                        : "text-red-600",
                            )}
                        >
                            {passwordValidation.message}
                        </div>
                    )}
                </div>
                <InputError message={errors.password} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                <div className="relative">
                    <Input
                        id="password_confirmation"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        autoComplete="new-password"
                        name="password_confirmation"
                        placeholder="Ulangi password"
                        onChange={(e) => onConfirmPasswordChange(e.target.value)}
                        className="pr-10"
                    />
                    <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                        tabIndex={-1}
                    >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
                {confirmPassword && !passwordsMatch && <p className="text-xs text-red-600">Password tidak cocok</p>}
                {confirmPassword && passwordsMatch && <p className="text-xs text-green-600">Password cocok</p>}
                <InputError message={errors.password_confirmation} />
            </div>
        </div>
    );
}
