export const isCommonPassword = async (
	password: string,
	listSize: '100' | '1000' | '10000' = '100'
) => {
	// List courtesy of https://github.com/danielmiessler/SecLists
	let passwords: string[] = [];

	const txt = await import(`./10-million-password-list-top-${listSize}.txt?raw`);
	passwords = txt.default.split('\n');

	return passwords.includes(password);
};
