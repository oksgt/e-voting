import { Form, Head } from "@inertiajs/react";
import { useRef, useState } from "react";
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
        onNikChange,
        onNowaChange,
        anggotaOptions,
        isLoadingAnggota,
        nikValidationStatus,
        nikValidationMessage,
        phoneValidationStatus,
        phoneValidationMessage,
    } = useRegisterHook();
    const nikInputRef = useRef<HTMLInputElement>(null);
    const nowaInputRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const isFormValid = nikValidationStatus === "valid" && phoneValidationStatus === "valid";

    const handleBidangChange = (value: string) => {
        setBidangValue(value);
        onBidangChange(value);
    };

    const validateStep = (currentStep: number): boolean => {
        if (currentStep === 1) {
            return !!bidangValue.trim() && !!nameValue.trim();
        }
        if (currentStep === 2) {
            return !!nikValue.trim() && !!nowaValue.trim() && nikValidationStatus === "valid" && phoneValidationStatus === "valid";
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
            containerClassName="max-w-sm sm:max-w-md"
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
                                    bidangOptions={bidangOptions}
                                    anggotaOptions={anggotaOptions}
                                    isLoading={isLoading}
                                    isLoadingAnggota={isLoadingAnggota}
                                    onBidangChange={handleBidangChange}
                                    setNameValue={setNameValue}
                                    errors={errors}
                                />

                                <StepDataPribadi
                                    visible={step === 2}
                                    nikInputRef={nikInputRef}
                                    nowaInputRef={nowaInputRef}
                                    nikValidationStatus={nikValidationStatus}
                                    nikValidationMessage={nikValidationMessage}
                                    phoneValidationStatus={phoneValidationStatus}
                                    phoneValidationMessage={phoneValidationMessage}
                                    onNikInput={(value) => {
                                        setNikValue(value);
                                        onNikChange(value);
                                    }}
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
