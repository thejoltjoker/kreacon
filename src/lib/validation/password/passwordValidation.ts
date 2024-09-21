export const isCommonPassword = async (
	password: string,
	listSize: '100' | '1000' | '10000' = '100'
): Promise<boolean> => {
	// List courtesy of https://github.com/danielmiessler/SecLists
	let passwords: string[] = [];

	const txt = await import(`./10-million-password-list-top-${listSize}.txt?raw`);
	passwords = txt.default.split('\n');

	return passwords.includes(password);
};

export const isLongEnough = (
	password: string,
	minLength: number = Number(process.env.PUBLIC_PASSWORD_MIN_LENGTH ?? 8)
): boolean => {
	return password.length >= minLength;
};

export const hasSpecialCharacter = (password: string): boolean => {
	return /[^a-zA-Z0-9\s\u00C0-\u024F]/.test(password);
};

export const hasNumber = (password: string): boolean => {
	return /\d/.test(password);
};

export type PasswordValidation = {
	isLongEnough: boolean;
	hasSpecialCharacter: boolean;
	isNotCommonPassword: boolean;
	isNotUsernameOrEmail: boolean;
	hasNumber: boolean;
};
