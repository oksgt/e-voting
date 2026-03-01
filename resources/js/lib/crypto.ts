import CryptoJS from "crypto-js";

/**
 * Decrypt an encrypted NIK string (base64 encoded IV + ciphertext).
 */
export function decryptNik(encrypted: string): string {
	const key = import.meta.env.VITE_NIK_ENCRYPTION_KEY;

	if (!key) {
		return encrypted;
	}

	const rawData = CryptoJS.enc.Base64.parse(encrypted);
	const rawBytes = rawData.toString(CryptoJS.enc.Hex);

	const ivHex = rawBytes.substring(0, 32);
	const ciphertextHex = rawBytes.substring(32);

	const iv = CryptoJS.enc.Hex.parse(ivHex);
	const ciphertext = CryptoJS.enc.Hex.parse(ciphertextHex);

	const keyUtf8 = CryptoJS.enc.Utf8.parse(key);

	const decrypted = CryptoJS.AES.decrypt({ ciphertext } as CryptoJS.lib.CipherParams, keyUtf8, {
		iv,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7,
	});

	return decrypted.toString(CryptoJS.enc.Utf8);
}
