import { useMemo, useState } from "react";

export type PasswordValidationStatus = "idle" | "weak" | "medium" | "strong";

export interface PasswordValidation {
	isValid: boolean;
	status: PasswordValidationStatus;
	message: string;
	requirements: {
		minLength: boolean;
		hasLowercase: boolean;
		hasUppercase: boolean;
		hasNumber: boolean;
	};
}

export function usePasswordValidation() {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const passwordValidation: PasswordValidation = useMemo(() => {
		if (!password) {
			return {
				isValid: false,
				status: "idle",
				message: "",
				requirements: {
					minLength: false,
					hasLowercase: false,
					hasUppercase: false,
					hasNumber: false,
				},
			};
		}

		const requirements = {
			minLength: password.length >= 8,
			hasLowercase: /[a-z]/.test(password),
			hasUppercase: /[A-Z]/.test(password),
			hasNumber: /\d/.test(password),
		};

		const metRequirements = Object.values(requirements).filter(Boolean).length;
		let status: PasswordValidationStatus = "weak";
		let message = "Password lemah";

		if (metRequirements === 4) {
			status = "strong";
			message = "Password kuat";
		} else if (metRequirements >= 2) {
			status = "medium";
			message = "Password cukup";
		}

		const isValid = requirements.minLength;

		return {
			isValid,
			status,
			message,
			requirements,
		};
	}, [password]);

	const passwordsMatch = useMemo(() => {
		if (!confirmPassword) return true;
		return password === confirmPassword;
	}, [password, confirmPassword]);

	const isPasswordValid = useMemo(() => {
		return passwordValidation.isValid && passwordsMatch && confirmPassword.length > 0;
	}, [passwordValidation.isValid, passwordsMatch, confirmPassword]);

	const togglePasswordVisibility = () => {
		setShowPassword((prev) => !prev);
	};

	const toggleConfirmPasswordVisibility = () => {
		setShowConfirmPassword((prev) => !prev);
	};

	return {
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
	};
}
