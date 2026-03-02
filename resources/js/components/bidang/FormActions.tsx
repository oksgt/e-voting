import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";

interface FormActionsProps {
    isSubmitting: boolean;
    submitLabel: string;
    onReset: () => void;
    onBack: () => void;
}

export const FormActions = ({ isSubmitting, submitLabel, onReset, onBack }: FormActionsProps) => (
    <Field orientation="horizontal" className="mt-6 flex justify-between">
        <Button variant="secondary" type="button" onClick={onBack}>
            Back
        </Button>
        <div className="flex gap-2">
            <Button variant="outline" type="button" onClick={onReset}>
                Reset
            </Button>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                    <span className="flex items-center gap-2">
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Processing...
                    </span>
                ) : (
                    submitLabel
                )}
            </Button>
        </div>
    </Field>
);
