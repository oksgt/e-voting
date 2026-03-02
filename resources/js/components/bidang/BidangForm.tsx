import { Controller, type UseFormReturn } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { BidangFormValues } from "@/hooks/useBidangForm";
import { FormActions } from "./FormActions";

interface BidangFormProps {
    form: UseFormReturn<BidangFormValues>;
    onSubmit: (values: BidangFormValues) => Promise<void>;
    legend: string;
    submitLabel: string;
}

export const BidangForm = ({ form, onSubmit, legend, submitLabel }: BidangFormProps) => {
    const { control, handleSubmit, formState, reset } = form;

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
                <FieldSet>
                    <FieldLegend>{legend}</FieldLegend>
                    <div className="flex flex-col gap-6 md:flex-row">
                        <div className="flex-1 space-y-4">
                            <Controller
                                name="nama_bidang"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="input-nama-bidang">Nama Bidang</FieldLabel>
                                        <Input {...field} id="input-nama-bidang" placeholder="Masukkan nama bidang" aria-invalid={fieldState.invalid} />
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
