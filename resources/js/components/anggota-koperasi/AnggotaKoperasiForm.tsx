import { Controller, type UseFormReturn } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AnggotaKoperasiFormValues } from "@/hooks/useAnggotaKoperasiForm";
import { FormActions } from "./FormActions";

interface AnggotaKoperasiFormProps {
    form: UseFormReturn<AnggotaKoperasiFormValues>;
    onSubmit: (values: AnggotaKoperasiFormValues) => Promise<void>;
    legend: string;
    submitLabel: string;
    bidangList: string[];
}

export const AnggotaKoperasiForm = ({ form, onSubmit, legend, submitLabel, bidangList }: AnggotaKoperasiFormProps) => {
    const { control, handleSubmit, formState, reset } = form;

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
                <FieldSet>
                    <FieldLegend>{legend}</FieldLegend>
                    <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Controller
                                name="nama"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="input-nama">Nama</FieldLabel>
                                        <Input {...field} id="input-nama" placeholder="Masukkan nama" aria-invalid={fieldState.invalid} />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="nik"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="input-nik">NIK</FieldLabel>
                                        <Input {...field} id="input-nik" placeholder="Masukkan NIK" aria-invalid={fieldState.invalid} />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="bidang"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="input-bidang">Bidang</FieldLabel>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger id="input-bidang" aria-invalid={fieldState.invalid}>
                                                <SelectValue placeholder="Pilih bidang" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {bidangList.map((b) => (
                                                    <SelectItem key={b} value={b}>
                                                        {b}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="nowa"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="input-nowa">No. WhatsApp</FieldLabel>
                                        <Input
                                            {...field}
                                            id="input-nowa"
                                            placeholder="Masukkan nomor WhatsApp"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </div>
                    </div>
                </FieldSet>

                <FormActions
                    isSubmitting={formState.isSubmitting}
                    submitLabel={submitLabel}
                    onReset={() => reset()}
                    onBack={() => window.history.back()}
                />
            </FieldGroup>
        </form>
    );
};
