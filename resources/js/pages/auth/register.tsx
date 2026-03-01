import { Form, Head } from "@inertiajs/react";
import { type ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";
import TextLink from "@/components/text-link";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { usePasswordValidation } from "@/hooks/use-password-validation";
import { useRegisterHook } from "@/hooks/use-register-hook";
import AuthLayout from "@/layouts/auth-layout";
import { login } from "@/routes";
import { store } from "@/routes/register";
import { StepDataPribadi } from "./register/step-data-pribadi";
import { StepIndicator } from "./register/step-indicator";
import { StepKeamananAkun } from "./register/step-keamanan-akun";
import { StepKoperasi } from "./register/step-koperasi";

const steps = [
    { number: 1, label: "Data Koperasi" },
    { number: 2, label: "Data Pribadi" },
    { number: 3, label: "Keamanan Akun" },
];

export default function Register() {
    const [step, setStep] = useState(1);
    const [bidangValue, setBidangValue] = useState("");
    const [nameValue, setNameValue] = useState("");
    const [nikValue, setNikValue] = useState("");
    const [nowaValue, setNowaValue] = useState("");
    const {
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        showPassword,
        showConfirmPassword,
        togglePasswordVisibility,
        toggleConfirmPasswordVisibility,
        passwordValidation,
        passwordsMatch,
        isPasswordValid,
    } = usePasswordValidation();
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
    const bidangRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const isFormValid = phoneValidationStatus === "valid";

    const handleBidangChange = (event: ChangeEvent<HTMLInputElement>) => {
        setBidangValue(event.target.value);
        onBidangChange(event.target.value);
    };

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        const name = event.target.value;
        setNameValue(name);
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

    const validateStep = (currentStep: number): boolean => {
        if (currentStep === 1) {
            return !!bidangValue.trim() && !!nameValue.trim();
        }
        if (currentStep === 2) {
            return !!nikValue.trim() && !!nowaValue.trim() && phoneValidationStatus === "valid";
        }
        if (currentStep === 3) {
            return isPasswordValid;
        }
        return true;
    };

    return (
        <AuthLayout
            title="Register Voter"
            description="Lengkapi data untuk membuat akun voter baru"
            containerClassName="max-w-md"
        >
            <Head title="Register" />

            <StepIndicator steps={steps} currentStep={step} />

            <Form
                {...store.form()}
                onSuccess={() => {
                    toast.success("Registrasi berhasil!", {
                        description: "Akun Anda telah dibuat. Selamat datang!",
                    });
                }}
                onError={(errors) => {
                    const errorMessages = Object.values(errors);
                    if (errorMessages.length > 0) {
                        const firstError = errorMessages[0] as string;
                        toast.error("Terjadi kesalahan", {
                            description: firstError || "Gagal membuat akun. Silakan coba lagi.",
                        });
                    }
                }}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => {
                    const handleNext = () => {
                        if (validateStep(step) && step < 3) {
                            setStep(step + 1);
                        }
                    };

                    const handleBack = () => {
                        if (step > 1) {
                            setStep(step - 1);
                        }
                    };

                    return (
                        <>
                            <div className="grid gap-6">
                                <StepKoperasi
                                    visible={step === 1}
                                    bidangRef={bidangRef}
                                    nameRef={nameRef}
                                    bidangOptions={bidangOptions}
                                    anggotaOptions={anggotaOptions}
                                    isLoading={isLoading}
                                    isLoadingAnggota={isLoadingAnggota}
                                    onBidangChange={handleBidangChange}
                                    onNameChange={handleNameChange}
                                    errors={errors}
                                />

                                <StepDataPribadi
                                    visible={step === 2}
                                    nikInputRef={nikInputRef}
                                    nowaInputRef={nowaInputRef}
                                    phoneValidationStatus={phoneValidationStatus}
                                    phoneValidationMessage={phoneValidationMessage}
                                    onNikInput={setNikValue}
                                    onNowaChange={onNowaChange}
                                    onNowaInput={setNowaValue}
                                    errors={errors}
                                />

                                <StepKeamananAkun
                                    visible={step === 3}
                                    passwordRef={passwordRef}
                                    password={password}
                                    confirmPassword={confirmPassword}
                                    showPassword={showPassword}
                                    showConfirmPassword={showConfirmPassword}
                                    passwordValidation={passwordValidation}
                                    passwordsMatch={passwordsMatch}
                                    onPasswordChange={setPassword}
                                    onConfirmPasswordChange={setConfirmPassword}
                                    togglePasswordVisibility={togglePasswordVisibility}
                                    toggleConfirmPasswordVisibility={toggleConfirmPasswordVisibility}
                                    errors={errors}
                                />

                                {/* Navigation Buttons */}
                                <div className="flex gap-3">
                                    {step > 1 && (
                                        <Button type="button" variant="outline" className="flex-1" onClick={handleBack}>
                                            Kembali
                                        </Button>
                                    )}
                                    {step < 3 ? (
                                        <Button type="button" className="flex-1" onClick={handleNext} disabled={!validateStep(step)}>
                                            Selanjutnya
                                        </Button>
                                    ) : (
                                        <Button
                                            type="submit"
                                            className="flex-1"
                                            data-test="register-user-button"
                                            disabled={!isFormValid || !isPasswordValid || processing}
                                        >
                                            {processing && <Spinner />}
                                            Daftar Sekarang
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div className="text-center text-sm text-muted-foreground">
                                Sudah punya akun? <TextLink href={login()}>Masuk di sini</TextLink>
                            </div>
                        </>
                    );
                }}
            </Form>
        </AuthLayout>
    );
}
