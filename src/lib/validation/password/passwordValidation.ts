export const isCommonPassword = async (
	password: string,
	listSize: '100' | '1000' | '10000' = '100'
): Promise<boolean> => {
	// List courtesy of https://github.com/danielmiessler/SecLists
	const txt = await import(`./10-million-password-list-top-${listSize}.txt?raw`);
	const passwords = txt.default.split('\n');

	return passwords.includes(password);
};

export const hasSpecialCharacter = (password: string): boolean => {
	return /[^a-zA-Z0-9\s\u00C0-\u024F]/.test(password);
};

export type PasswordValidation = {
	isLongEnough: boolean;
	hasSpecialCharacter: boolean;
	isNotCommonPassword: boolean;
	isNotUsernameOrEmail: boolean;
	hasNumber: boolean;
};
